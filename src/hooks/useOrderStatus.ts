import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket, WsMessage } from './useWebSocket';
import { useWsStore } from '../store/wsStore';

const ORDER_EVENTS = new Set([
  'PEDIDO_CONFIRMADO',
  'PEDIDO_EN_PREPARACION',
  'PEDIDO_EN_CAMINO',
  'PEDIDO_ENTREGADO',
  'PEDIDO_CANCELADO',
  'WS_RECONNECTED',
]);

export function useOrderStatus(orderId?: number) {
  const { disconnect } = useWsStore();
  const queryClient = useQueryClient();

  const handleMessage = (msg: WsMessage) => {
    if (msg.event === 'WS_CONNECTED' || msg.event === 'WS_RECONNECTED') {
      if (orderId) {
        subscribeToOrder(orderId);
      }
      if (msg.event === 'WS_RECONNECTED' && orderId) {
        queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    } else if (ORDER_EVENTS.has(msg.event) && orderId) {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  };

  const { subscribeToOrder, unsubscribeFromOrder } = useWebSocket({
    onMessage: handleMessage,
    enabled: !!orderId,
  });

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { subscribeToOrder, unsubscribeFromOrder };
}

