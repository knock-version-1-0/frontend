import { useRef, useEffect, useState, useCallback } from 'react';

import { ApiPayload } from './types.util';
import { LOADING } from '@/api/status';

export const useWebSocket = <ResponseData>(url: string): {
  payload: ApiPayload<ResponseData>;
  sendMessage: (message: string) => void;
  clear: () => void;
} => {
  const socketRef = useRef<WebSocket>();
  const [payload, setPayload] = useState<ApiPayload<ResponseData>>({ status: LOADING });

  useEffect(() => {
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_PROTOCOL_TYPE}://${process.env.NEXT_PUBLIC_SERVER_URL}${url}`);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    }

    socket.onmessage = (event) => {
      const data: ApiPayload<ResponseData> = JSON.parse(event.data);
      setPayload(data);
      console.log('WebSocket message received:', event.data);
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    }

    socketRef.current = socket;

    return () => {
      socketRef.current?.close();
    }
  }, [payload]);

  const clear = useCallback(() => {
    setPayload({ status: LOADING })
  }, [setPayload]);

  const sendMessage = useCallback((message: string) => {
    socketRef.current?.send(message)
  }, []);

  return {
    payload,
    sendMessage,
    clear
  }
}
