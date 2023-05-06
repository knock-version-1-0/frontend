import axios, { AxiosError } from 'axios'
import { useRef, useEffect, useState, useCallback } from 'react'

import { ErrorDetail, ApiPayload } from './types.util'

export const Axios = () =>
  axios.create({
    baseURL: `http://${process.env.NEXT_PUBLIC_SERVER_URL}`,
    withCredentials: true,
    headers: {
      'Content-type': 'application/json',
    },
  })

export const AxiosWithJwt = (jwtToken: string) =>
  axios.create({
    baseURL: `http://${process.env.NEXT_PUBLIC_SERVER_URL}`,
    withCredentials: true,
    headers: {
      'Content-type': 'application/json',
      authorization: `Token ${jwtToken}`,
    },
  })

export interface Response {
  statusCode: number
  types: string[]
}

export const getApiStatus = <T>(error: unknown, responses: Response[]): ApiPayload<T> => {
  if (error instanceof AxiosError) {
    const res = error.response!
    const detail = res.data as ErrorDetail

    for (let response of responses) {
      if (res.status === response.statusCode) {
        if (response.types.includes(detail.type)) return {
          status: detail.type
        }
      }
    }
  }
  throw error
}

export const useWebSocket = <ResponseData>(url: string): {
  payload: ApiPayload<ResponseData>
  sendMessage: (message: string) => void
  clear: () => void
} => {
  const socketRef = useRef<WebSocket>();
  const [payload, setPayload] = useState<ApiPayload<ResponseData>>({status: 'LOADING'})
  
  useEffect(() => {
    const socket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_SERVER_URL}${url}`)

    socket.onopen = () => {
      console.log('WebSocket connection opened')
    }

    socket.onmessage = (event) => {
      const data: ApiPayload<ResponseData> = JSON.parse(event.data)
      setPayload(data)
      console.log('WebSocket message received:', event.data)
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed')
    }

    socketRef.current = socket

    return () => {
      socketRef.current?.close()
    }
  }, [payload])

  const clear = useCallback(() => {
    setPayload({status: 'LOADING'})
  }, [setPayload])

  const sendMessage = useCallback((message: string) => {
    socketRef.current?.send(message)
  }, [])

  return {
    payload,
    sendMessage,
    clear
  }
}
