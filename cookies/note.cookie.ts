import { getCookie, setCookie, deleteCookie } from "cookies-next"
import { NOTE_ITEMS_KEY, NOTE_OFFSET_KEY } from "@/constants/note.constant"

import { NoteSummaryModel } from "@/models/notes.model"

import { ServerSideOpt } from "@/utils/cookie.util"

export const getNoteItemsFromCookie = ({ req, res }: ServerSideOpt): NoteSummaryModel[] | null => {
  const cookie = getCookie(NOTE_ITEMS_KEY, { req, res })
  if (cookie) return JSON.parse(cookie as string) as NoteSummaryModel[]
  else return null
}

export const setNoteItemsFromCookie = (data: NoteSummaryModel[], { req, res }: ServerSideOpt): void => {
  setCookie(NOTE_ITEMS_KEY, data, { req, res })
}

export const removeNoteItemsFromCookie = ({ req, res }: ServerSideOpt): void => {
  deleteCookie(NOTE_ITEMS_KEY, { req, res })
}

export const getNoteOffsetFromCookie = (): number | null => {
  const cookie = getCookie(NOTE_OFFSET_KEY)
  if (cookie) return Number(cookie as string)
  else return null
}

export const setNoteOffsetFromCookie = (offset: number): void => {
  setCookie(NOTE_OFFSET_KEY, offset)
}
