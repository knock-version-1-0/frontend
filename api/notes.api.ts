import { Axios, AxiosWithJwt, getApiStatus } from "@/utils/http.util";
import qs from "qs";

import { NoteData, NoteFilterData } from "./data/notes";
import { NoteEntity } from "@/models/notes.model";
import { NoteSummaryEntity } from "@/models/notes.model";
import { TRAILING_SLASH } from "@/constants/common.constant";
import {
  NoteDoesNotExist,
  NoteNameDuplicate,
  UserInvalid,
  UserPermissionDenied,
  NoteNameLengthOver,
  DatabaseError
} from "./status";
import { ApiPayload, ErrorDetail } from "@/utils/types.util";

const APP_NAME = 'notes';

export const fetchGetNoteByDisplayIdApi = async (displayId: string, token: string): Promise<ApiPayload<NoteEntity>> => {
  try {
    const res = await AxiosWithJwt(token)
      .get<ApiPayload<NoteEntity> | ErrorDetail>(`${APP_NAME}/${displayId}${TRAILING_SLASH}`);
    const resData = res.data as ApiPayload<NoteEntity>;
    return resData;
  } catch (err: unknown) {
    return getApiStatus<NoteEntity>(err, [
      {
        statusCode: 401,
        types: [UserInvalid]
      },
      {
        statusCode: 403,
        types: [UserPermissionDenied]
      },
      {
        statusCode: 404,
        types: [NoteDoesNotExist]
      }
    ]);
  }
}

export const fetchPostNotesApi = async (data: NoteData, token: string): Promise<ApiPayload<NoteEntity>> => {
  try {
    const res = await AxiosWithJwt(token)
      .post<ApiPayload<NoteEntity> | ErrorDetail>(`${APP_NAME}${TRAILING_SLASH}`, data=data);
    const resData = res.data as ApiPayload<NoteEntity>;
    return resData;
  } catch (err: unknown) {
    return getApiStatus<NoteEntity>(err, [
      {
        statusCode: 400,
        types: [NoteNameDuplicate]
      },
      {
        statusCode: 401,
        types: [UserInvalid]
      },
      {
        statusCode: 403,
        types: [UserPermissionDenied]
      }
    ]);
  }
}

export const fetchGetNotesApi = async ({ name, offset }: NoteFilterData, token: string): Promise<ApiPayload<NoteSummaryEntity[]>> => {
  const query = qs.stringify({
    name,
    offset
  });
  try {
    const res = await AxiosWithJwt(token)
      .get<ApiPayload<NoteSummaryEntity[]> | ErrorDetail>(`${APP_NAME}${TRAILING_SLASH}?${query}`);
    const resData = res.data as ApiPayload<NoteSummaryEntity[]>;
    return resData;
  } catch (err: unknown) {
    return getApiStatus<NoteSummaryEntity[]>(err, [
      {
        statusCode: 401,
        types: [UserInvalid]
      }
    ]);
  }
}

export const fetchDeleteNoteApi = async (displayId: string, token: string): Promise<null> => {
  const res = await AxiosWithJwt(token).delete<null | ErrorDetail>(`${APP_NAME}/${displayId}${TRAILING_SLASH}`);
  if (res.status === 204) return null;
  throw Error(JSON.stringify(res));
}

export const fetchPatchNoteApi = async (data: NoteData, displayId: string, token: string): Promise<ApiPayload<NoteEntity>> => {
  try {
    const res = await AxiosWithJwt(token)
      .patch<ApiPayload<NoteEntity> | ErrorDetail>(`${APP_NAME}/${displayId}${TRAILING_SLASH}`, data);
    const resData = res.data as ApiPayload<NoteEntity>;
    return resData;
  } catch (err: unknown) {
    return getApiStatus<NoteEntity>(err, [
      {
        statusCode: 400,
        types: [NoteNameLengthOver, NoteNameDuplicate]
      },
      {
        statusCode: 401,
        types: [UserInvalid]
      },
      {
        statusCode: 403,
        types: [UserPermissionDenied]
      },
      {
        statusCode: 404,
        types: [NoteDoesNotExist]
      },
      {
        statusCode: 500,
        types: [DatabaseError]
      }
    ]);
  }
}
