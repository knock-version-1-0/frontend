import { Axios, AxiosWithJwt } from "@/utils/http.util"

import { NoteData } from "./data/notes"
import { NoteEntity } from "@/models/notes.model"
import { NoteSummaryEntity } from "@/models/notes.model"
import { TRAILING_SLASH } from "@/constants/common.constant"

import qs from "qs"

const APP_NAME = 'notes'

export const ApiGetNoteByDisplayId = (displayId: string, token: string) =>
  AxiosWithJwt(token)
    .get<NoteEntity>(`${APP_NAME}/${displayId}${TRAILING_SLASH}`)
    .then(res => res.data)
    .catch(err => err.response)

export const ApiPostNotes = (data: NoteData, token: string) =>
  AxiosWithJwt(token)
    .post<NoteEntity>(`${APP_NAME}${TRAILING_SLASH}`, data=data)
    .then(res => res.data)
    .catch(err => err.response)

export const ApiGetNotes = async ({ name, offset }: {name?: string; offset?: number}, token: string) => {
  const query = qs.stringify({
    name,
    offset
  })
  return AxiosWithJwt(token)
    .get<NoteSummaryEntity[]>(`${APP_NAME}${TRAILING_SLASH}?${query}`)
    .then(res => res.data)
    .catch(err => err.response)
}
