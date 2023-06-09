import axios, { AxiosError } from 'axios';

import { ErrorDetail, ApiPayload } from './types.util';

export const Axios = (headers: object = {}) =>
  axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_HTTP_PROTOCOL_TYPE}://${process.env.NEXT_PUBLIC_SERVER_URL}`,
    withCredentials: true,
    headers: {
      'Content-type': 'application/json',
      ...headers
    },
  });

export const AxiosWithJwt = (jwtToken: string, headers: object = {}) =>
  axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_HTTP_PROTOCOL_TYPE}://${process.env.NEXT_PUBLIC_SERVER_URL}`,
    withCredentials: true,
    headers: {
      'Content-type': 'application/json',
      authorization: `Token ${jwtToken}`,
      ...headers
    },
  });

export interface Response {
  statusCode: number;
  types: string[];
}

export const getApiErrorPayload = <T>(error: unknown, responses: Response[]): ApiPayload<T> => {
  if (error instanceof AxiosError) {
    const res = error.response!;
    const detail = res.data as ErrorDetail;

    for (let response of responses) {
      if (res.status === response.statusCode) {
        if (response.types.includes(detail.type)) return {
          status: detail.type
        }
      }
    }
  }
  throw error;
}
