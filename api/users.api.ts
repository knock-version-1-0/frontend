import { Axios, AxiosWithJwt, getApiStatus } from "@/utils/http.util"
import qs from "qs"

import { 
  AuthTokenData,
  AuthEmailData
} from "./data/users"
import {
  AuthTokenEntity,
  AuthSessionEntity
} from "@/models/users.model"
import { TRAILING_SLASH } from "@/constants/common.constant"
import {
  UserInvalid,
  RefreshTokenExpired,
  RefreshTokenRequired,
  EmailAddrValidationError,
  EmailSendFailed,
  DatabaseError
} from "./status"
import { ApiPayload, ErrorDetail } from "@/utils/types.util"

export const fetchPostAuthTokenApi = async (data: AuthTokenData) => {
  try {
    const res = await Axios({'Cache-Control': 'public, max-age=1800'})
      .post<ApiPayload<AuthTokenEntity> | ErrorDetail>(`auth/token${TRAILING_SLASH}`, data=data)
    const resData = res.data as ApiPayload<AuthTokenEntity>
    return resData
  } catch (err: unknown) {
    return getApiStatus<AuthTokenEntity>(err, [
      {
        statusCode: 400,
        types: [RefreshTokenExpired, RefreshTokenRequired]
      },
      {
        statusCode: 401,
        types: [UserInvalid]
      }
    ])
  }
}

export const fetchPostAuthEmailApi = async (data: AuthEmailData) => {
  try {
    const res = await Axios()
      .post<ApiPayload<AuthSessionEntity> | ErrorDetail>(`auth/email${TRAILING_SLASH}`, data=data)
    const resData = res.data as ApiPayload<AuthSessionEntity>
    return resData
  } catch (err: unknown) {
    return getApiStatus<AuthSessionEntity>(err, [
      {
        statusCode: 400,
        types: [EmailAddrValidationError]
      },
      {
        statusCode: 500,
        types: [EmailSendFailed, DatabaseError]
      }
    ])
  }
}
