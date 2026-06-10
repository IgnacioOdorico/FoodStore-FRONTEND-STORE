import { useEffect, useRef, useCallback } from 'react';

export interface WsMessage {
  event: string;
  data: unknown;
}

interface UseWebSocketOptions {
  onMessage?: (msg: WsMessage) => void;
  enabled?: boolean;
}

/**
 * Hook que gestiona una conexión WebSocket persistente con el backend.
 *
 * AUTENTICACIÓN
 * El backend autentica el socket leyendo la cookie httpOnly que el navegador
 * envía automáticamente durante el handshake HTTP → WS. No se necesita
 * pasar ningún header o token manualmente.
 * Si la cookie no es válida el servidor cierra con código 1008 (Policy Violation)
 * y el hook NO reintenta para no hacer bucles de reconexión sin sentido.
 *
 * ROOMS / SUSCRIPCIONES
 * Al conectarse el backend automáticamente une el socket a la sala "role:{rol}".
 * Para los clientes (role:user), los eventos llegan solo si se suscriben a un
 * pedido concreto llamando a subscribeToOrder(id), lo que hace que el backend
 * también los una a "order:{id}".
 * Esto permite recibir actualizaciones granulares por pedido en tiempo real.
 *
 * RECONEXIÓN CON BACKOFF EXPONENCIAL
 * Si la conexión se cierra de forma anormal (cualquier código que no sea 1000 ni 1008)
 * el hook programa un reintento con backoff exponencial:
 *   intento 1 → 2 s, intento 2 → 4 s, intento 3 → 8 s … máximo 30 s.
 * Al reconectarse exitosamente el contador se reinicia.
 *
 * EVENTO SINTÉTICO WS_CONNECTED
 * El backend no emite ningún mensaje al conectarse. Para que las páginas puedan
 * reaccionar a la (re)conexión —por ejemplo recargando datos y re-suscribiéndose
 * a pedidos activos— el hook emite un mensaje local ficticio con event "WS_CONNECTED"
 * en el handler onopen, antes de que llegue cualquier mensaje real del servidor.
 *
 * COMPATIBILIDAD CON REACT STRICTMODE
 * En desarrollo React monta, desmonta y vuelve a montar cada componente.
 * El flag `cancelled` y la función closeCleanly garantizan que si el efecto
 * se limpia mientras el socket está en CONNECTING, la conexión se cierra
 * en cuanto abre, sin dejar sockets huérfanos.
 */
export function useWebSocket({
  onMessage,
  enabled = true,
}: UseWebSocketOptions = {}) {
  // Referencia al socket activo para poder enviar mensajes desde fuera del efecto
  // (subscribeToOrder / unsubscribeFromOrder). Se usa ref en lugar de state para
  // no provocar re-renders al cambiar el socket.
  const wsRef = useRef<WebSocket | null>(null);

  // Ref al callback onMessage para evitar que el efecto se re-ejecute
  // cada vez que el padre re-renderiza con una nueva función anónima.
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled) return;

    // Flag que se activa al desmontar o cuando `enabled` cambia a false.
    let cancelled = false;

    // Número de intentos de reconexión fallidos consecutivos.
    // Se usa para calcular el delay exponencial.
    let retryCount = 0;

    // Timer de reconexión pendiente (para cancelarlo en cleanup).
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    // Referencia local al socket del intento actual.
    let currentWs: WebSocket | null = null;

    /**
     * Cierra el socket de forma segura teniendo en cuenta su estado actual.
     * No se puede llamar ws.close() mientras el socket está en CONNECTING.
     */
    const closeCleanly = (ws: WebSocket) => {
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener('open', () => ws.close(1000), { once: true });
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000);
      }
    };

    const connect = () => {
      if (cancelled) return;

      const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';
      const wsUrl = BASE_URL.replace(/^http/, 'ws') + '/pedidos/ws';

      const ws = new WebSocket(wsUrl);
      currentWs = ws;
      // Exponemos el socket en wsRef para que subscribeToOrder pueda usarlo
      // en cuanto el socket esté OPEN.
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) {
          // El componente se desmontó mientras conectaba (StrictMode).
          ws.close(1000);
          return;
        }
        // Reconexión exitosa: resetear el backoff.
        retryCount = 0;
        // Emitir evento sintético para que las páginas sepan que el canal está
        // listo y puedan recargar datos o re-suscribirse a pedidos activos.
        onMessageRef.current?.({ event: 'WS_CONNECTED', data: null });
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const msg = JSON.parse(event.data as string) as WsMessage;
          onMessageRef.current?.(msg);
        } catch {
          // Ignorar mensajes malformados.
        }
      };

      ws.onerror = () => {
        // Los errores de WebSocket siempre van seguidos de onclose.
        // Toda la lógica de reconexión se centraliza allí.
      };

      ws.onclose = (e) => {
        if (wsRef.current === ws) wsRef.current = null;
        currentWs = null;

        const wasNormal = e.code === 1000;       // cierre limpio / intencional
        const wasAuthRejected = e.code === 1008; // token inválido o expirado

        // No reintentar si: desmontado, cierre limpio, o auth rechazada.
        if (cancelled || wasNormal || wasAuthRejected) return;

        // Backoff exponencial con techo de 30 s.
        // Fórmula: 1000 * 2^retryCount → 2 s, 4 s, 8 s, 16 s, 30 s, 30 s…
        retryCount++;
        const delay = Math.min(1000 * 2 ** retryCount, 30_000);
        console.warn(`[WS Store] Reconectando en ${delay / 1000}s (intento ${retryCount})`);
        retryTimer = setTimeout(connect, delay);
      };
    };

    connect();

    // Cleanup: cancela reconexiones pendientes y cierra el socket activo.
    return () => {
      cancelled = true;
      if (retryTimer !== null) clearTimeout(retryTimer);
      if (currentWs) closeCleanly(currentWs);
      wsRef.current = null;
    };
  }, [enabled]);

  /**
   * Envía un mensaje al backend para suscribirse a la sala "order:{orderId}".
   * A partir de ese momento el backend enrutará los eventos de ese pedido
   * específicamente a este socket.
   * Si el socket no está abierto la llamada es silenciosa (no lanza error).
   */
  const subscribeToOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: 'subscribe-order', order_id: orderId }),
      );
    }
  }, []);

  /**
   * Envía un mensaje al backend para desuscribirse de "order:{orderId}".
   * Útil cuando un pedido llega a un estado terminal (ENTREGADO / CANCELADO)
   * y ya no necesita actualizaciones en tiempo real.
   */
  const unsubscribeFromOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: 'unsubscribe-order', order_id: orderId }),
      );
    }
  }, []);

  return { subscribeToOrder, unsubscribeFromOrder };
}
