import { useEffect, useRef, useCallback } from 'react';
import { useWsStore } from '../store/wsStore';

export interface WsMessage {
  event: string;
  data: unknown;
}

interface UseWebSocketOptions {
  onMessage?: (msg: WsMessage) => void;
  enabled?: boolean;
}

// Hook useWebSocket 
export function useWebSocket({
  onMessage,
  enabled = true,
}: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const { connect: wsConnect, disconnect: wsDisconnect } = useWsStore();

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    let retryCount = 0;

    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    let currentWs: WebSocket | null = null;

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
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) {
          ws.close(1000);
          return;
        }
        retryCount = 0;
        wsConnect();
        onMessageRef.current?.({ event: 'WS_CONNECTED', data: null });
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const msg = JSON.parse(event.data as string) as WsMessage;
          onMessageRef.current?.(msg);
        } catch { }
      };

      ws.onerror = () => { };

      ws.onclose = (e) => {
        if (wsRef.current === ws) wsRef.current = null;
        currentWs = null;
        wsDisconnect();

        const wasNormal = e.code === 1000;
        const wasAuthRejected = e.code === 1008;

        if (cancelled || wasNormal || wasAuthRejected) return;

        retryCount++;
        const delay = Math.min(1000 * 2 ** retryCount, 30_000);
        console.warn(`[WS Store] Reconectando en ${delay / 1000}s (intento ${retryCount})`);
        retryTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer !== null) clearTimeout(retryTimer);
      if (currentWs) closeCleanly(currentWs);
      wsRef.current = null;
    };
  }, [enabled]);

  const subscribeToOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: 'subscribe-order', order_id: orderId }),
      );
    }
  }, []);

  const unsubscribeFromOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: 'unsubscribe-order', order_id: orderId }),
      );
    }
  }, []);

  return { subscribeToOrder, unsubscribeFromOrder };
}
