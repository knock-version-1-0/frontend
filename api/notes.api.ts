import { Axios, AxiosWithJwt } from "@/utils/http.util"

import { NoteData } from "./data/notes"
import { NoteEntity } from "@/models/notes.model"
import { NoteSummaryEntity } from "@/models/notes.model"
import { TRAILING_SLASH } from "@/constants/common.constant"
import {
  NoteDoesNotExist,
  UserInvalid,
  UserPermissionDenied,
  NoteNameDuplicate
} from "@/utils/status.util"
import { ErrorDetail } from "@/utils/types.util"

import qs from "qs"
import { AxiosError } from "axios"

const APP_NAME = 'notes'

export const ApiGetNoteByDisplayId = async (displayId: string, token: string) => {
  try {
    const res = await AxiosWithJwt(token)
      .get<NoteEntity | ErrorDetail>(`${APP_NAME}/${displayId}${TRAILING_SLASH}`)
    const resData = res.data
    return {
      status: 'OK',
      data: resData
    }
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const res = err.response!
      const detail = res.data as ErrorDetail

      if (res.status === 401) {
        if (detail.type === UserInvalid) {
          return {
            status: UserInvalid,
            data: null
          }
        }
      } else if (res.status === 403) {
        if (detail.type === UserPermissionDenied) {
          return {
            status: UserPermissionDenied,
            data: null
          }
        }
      } else if (res.status === 404) {
        if (detail.type === NoteDoesNotExist) {
          return {
            status: NoteDoesNotExist,
            data: null
          }
        }
      }
    }
    throw err
  }
}

export const ApiPostNotes = async (data: NoteData, token: string) => {
  try {
    const res = await AxiosWithJwt(token)
      .post<NoteEntity | ErrorDetail>(`${APP_NAME}${TRAILING_SLASH}`, data=data)
    const resData = res.data

    return {
      status: 'OK',
      data: resData
    }
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const res = err.response!
      const detail = res.data as ErrorDetail

      if (res.status === 400) {
        if (detail.type === NoteNameDuplicate) {
          return {
            status: NoteNameDuplicate,
            data: null
          }
        }
      } else if (res.status === 401) {
        if (detail.type === UserInvalid) {
          return {
            status: UserInvalid,
            data: null
          }
        }
      } else if (res.status === 403) {
        if (detail.type === UserPermissionDenied) {
          return {
            status: UserPermissionDenied,
            data: null
          }
        }
      }
    }
    throw err
  }
}

export const ApiGetNotes = async ({ name, offset }: {name?: string; offset?: number}, token: string) => {
  const query = qs.stringify({
    name,
    offset
  })
  try {
    const res = await AxiosWithJwt(token)
      .get<NoteSummaryEntity[] | ErrorDetail>(`${APP_NAME}${TRAILING_SLASH}?${query}`)
    const resData = res.data
    return {
      status: 'OK',
      data: resData
    }
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const res = err.response!
      const detail = res.data as ErrorDetail
      if (res.status === 401) {
        if (detail.type === UserInvalid) {
          return {
            status: UserInvalid,
            data: null
          }
        }
      }
    }
    throw err
  }
}

export const ApiDeleteNote = async (displayId: string, token: string) => {
  const res = await AxiosWithJwt(token).delete<null | ErrorDetail>(`${APP_NAME}/${displayId}${TRAILING_SLASH}`)
  if (res.status === 204) return null
  throw Error(JSON.stringify(res))
}
