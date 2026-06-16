import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';
import type { WsMessage } from './useWebSocket';
import { useWsStore } from '../store/wsStore';

const ORDER_EVENTS = new Set([
  'PEDIDO_CONFIRMADO',
  'PEDIDO_EN_PREPARACION',
  'PEDIDO_EN_CAMINO',
  'PEDIDO_ENTREGADO',
  'PEDIDO_CANCELADO',
]);

export { type WsMessage };

export function useOrderStatus(onMessage?: (msg: WsMessage) => void) {
  const { disconnect } = useWsStore();
  const queryClient = useQueryClient();
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const handleMessage = (msg: WsMessage) => {
    onMessageRef.current?.(msg);

    if (msg.event === 'WS_RECONNECTED') {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }

    if (ORDER_EVENTS.has(msg.event)) {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      const payload = msg.data as { id?: number } | null;
      if (payload?.id) {
        queryClient.invalidateQueries({ queryKey: ['order', payload.id] });
      }
    }
  };

  const { subscribeToOrder, unsubscribeFromOrder } = useWebSocket({
    onMessage: handleMessage,
    enabled: true,
  });

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { subscribeToOrder, unsubscribeFromOrder };
}

