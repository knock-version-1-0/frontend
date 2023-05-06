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

export const useWebSocket = <ResponseData, RequestData>(url: string, data: RequestData, token?: string): {
  payload: ApiPayload<ResponseData>
  isClose: React.MutableRefObject<boolean>
  send: () => void
} => {
  const socketRef = useRef<WebSocket>();
  const [payload, setPayload] = useState<ApiPayload<ResponseData>>({status: 'LOADING'})
  const isClose = useRef<boolean>(false)
  
  useEffect(() => {
    const socket = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
      token ? [`Authorization: Token ${token}`] : undefined
    )

    socket.onopen = () => {
      console.log('WebSocket connection opened')
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setPayload({
        status: 'OK',
        data: data
      })
      isClose.current = true
      console.log('WebSocket message received:', event.data)
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed')
    }

    socketRef.current = socket

    return () => {
      socketRef.current?.close()
    }
  }, [payload, isClose.current])

  const send = useCallback(() => {
    const message = JSON.stringify(data)
    socketRef.current?.send(message)
  }, [data])

  return {
    payload,
    isClose,
    send
  }
}

export const sendWebSocketData = <ResponseData, RequestData>(url: string, data: RequestData, token?: string) => {
  const {payload, send, isClose} = useWebSocket<ResponseData, RequestData>(url, data, token)
  send()

  return new Promise((resolve: (value: ApiPayload<ResponseData>) => void) => {
    const intervalId = setInterval(() => {
      if (isClose.current) {
        clearInterval(intervalId)
        resolve(payload)
      }
    }, 100)
  })
}
