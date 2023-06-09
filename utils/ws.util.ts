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
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_PROTOCOL_TYPE}://${process.env.NEXT_PUBLIC_SERVER_HOST}${url}`);

    socket.onopen = () => {}

    socket.onmessage = (event) => {
      const data: ApiPayload<ResponseData> = JSON.parse(event.data);
      setPayload(data);
    }

    socket.onclose = () => {}

    socketRef.current = socket;

    return () => {
      socketRef.current?.close();
    }
  }, [payload]);

  const clear = useCallback(() => {
    setPayload({ status: LOADING });
  }, [setPayload]);

  const sendMessage = useCallback((message: string) => {
    socketRef.current?.send(message);
  }, []);

  return {
    payload,
    sendMessage,
    clear
  }
}

interface MessageDataOption {
  key?: string | number,
  token?: string
}

export const toMessage = <T>(method: 'update' | 'create' | 'delete', data: T, option?: MessageDataOption) => {
  return JSON.stringify({
    data: JSON.stringify(data),
    key: option?.key,
    authorization: `Token ${option?.token}`,
    method: method
  });
}
