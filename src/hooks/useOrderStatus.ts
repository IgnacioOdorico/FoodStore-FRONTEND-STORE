import { useEffect } from 'react';
import { useWebSocket, WsMessage } from './useWebSocket';
import { useWsStore } from '../store/wsStore';

export function useOrderStatus(orderId?: number) {
  const { connect, disconnect } = useWsStore();
  
  const handleMessage = (msg: WsMessage) => {
    if (msg.event === 'WS_CONNECTED') {
      connect();
      if (orderId) {
        subscribeToOrder(orderId);
      }
    } else {
      // Manejar cambios de estado y react-query invalidate queries aquí
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
