import { Axios, AxiosWithJwt, getApiErrorPayload } from "@/utils/http.util";
import qs from "qs";

import { 
  AuthTokenData,
  AuthEmailData,
  AuthVerificationData,
  UserData
} from "./data/users";
import {
  AuthTokenEntity,
  AuthSessionEntity
} from "@/models/users.model";
import { TRAILING_SLASH } from "@/constants/common.constant";
import {
  UserInvalid,
  RefreshTokenExpired,
  RefreshTokenRequired,
  EmailAddrValidationError,
  EmailSendFailed,
  DatabaseError,
  AttemptLimitOver,
  AuthSessionExpired,
  AuthSessionDoesNotExist,
  AuthenticationFailed,
  OK
} from "./status";
import { ApiPayload, ErrorDetail } from "@/utils/types.util";

export const fetchPostAuthTokenApi = async (data: AuthTokenData): Promise<ApiPayload<AuthTokenEntity>> => {
  try {
    const res = await Axios({'Cache-Control': 'public, max-age=1800'})
      .post<ApiPayload<AuthTokenEntity> | ErrorDetail>(`auth/token${TRAILING_SLASH}`, data=data);
    const resData = res.data as ApiPayload<AuthTokenEntity>;
    return resData;
  } catch (err: unknown) {
    return getApiErrorPayload<AuthTokenEntity>(err, [
      {
        statusCode: 400,
        types: [RefreshTokenExpired, RefreshTokenRequired]
      },
      {
        statusCode: 401,
        types: [UserInvalid]
      }
    ]);
  }
}

export const fetchPostAuthEmailApi = async (data: AuthEmailData): Promise<ApiPayload<AuthSessionEntity>> => {
  try {
    const res = await Axios()
      .post<ApiPayload<AuthSessionEntity> | ErrorDetail>(`auth/email${TRAILING_SLASH}`, data=data);
    const resData = res.data as ApiPayload<AuthSessionEntity>;
    return resData;
  } catch (err: unknown) {
    return getApiErrorPayload<AuthSessionEntity>(err, [
      {
        statusCode: 400,
        types: [EmailAddrValidationError]
      },
      {
        statusCode: 500,
        types: [EmailSendFailed, DatabaseError]
      }
    ]);
  }
}

export const fetchPostAuthVerificationApi = async (data: AuthVerificationData): Promise<ApiPayload<null>> => {
  try {
    const res = await Axios()
      .post<ApiPayload<{}>  | ErrorDetail>(`auth/verification${TRAILING_SLASH}`, data=data);
    return {
      data: null,
      status: OK
    }
  } catch (err: unknown) {
    return getApiErrorPayload<null>(err, [
      {
        statusCode: 400,
        types: [AttemptLimitOver, AuthSessionExpired]
      },
      {
        statusCode: 401,
        types: [AuthenticationFailed]
      },
      {
        statusCode: 404,
        types: [AuthSessionDoesNotExist]
      },
      {
        statusCode: 500,
        types: [DatabaseError]
      }
    ]);
  }
}

type tokens = {
  accessToken: string,
  refreshToken: string
}

export const fetchPostUsersApi = async (data: UserData): Promise<ApiPayload<tokens>> => {
  try {
    const res = await Axios()
      .post<ApiPayload<tokens> | ErrorDetail>(`users${TRAILING_SLASH}`, data=data);
    const resData = res.data as ApiPayload<tokens>;
    return resData;
  } catch (err: unknown) {
    return getApiErrorPayload<tokens>(err, [
      {
        statusCode: 500,
        types: [DatabaseError]
      }
    ]);
  }
}
