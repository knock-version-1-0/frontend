import { Axios, AxiosWithJwt } from "@/utils/http.util"

import { NoteRequestBody, KeywordRequestBody } from "./interfaces/notes"
import { NoteModel } from "@/models/notes.model"
import { NoteSummaryModel } from "@/models/notes.model"

import { TRAILING_SLASH } from "@/constants/common.constant"

const APP_NAME = 'notes'

export const getNoteByDisplayId = (displayId: string, token: string) =>
  AxiosWithJwt(token)
    .get<NoteModel>(`${APP_NAME}/${displayId}${TRAILING_SLASH}`)
    .then(res => res)
    .catch(err => err.response)

export const postNotes = (data: NoteRequestBody, token: string) =>
  AxiosWithJwt(token)
    .post<NoteModel>(`${APP_NAME}${TRAILING_SLASH}`, data=data)
    .then(res => res)
    .catch(err => err.response)

export const getNotes = (name: string, offset: number, token: string) =>
  AxiosWithJwt(token)
    .get<NoteSummaryModel[]>(`${APP_NAME}${TRAILING_SLASH}?name=${name}&offset=${offset}`)
    .then(res => res)
    .catch(err => err.response)
