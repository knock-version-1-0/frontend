import { getCookie, setCookie, deleteCookie } from "cookies-next"
import { NOTE_ITEMS_KEY } from "@/constants/note.constant"

import { NoteSummaryModel } from "@/models/notes.model"

import { ServerSideOpt } from "@/utils/cookie.util"

export const getNoteItemsFromCookie = ({ req, res }: ServerSideOpt): NoteSummaryModel[] => {
  const cookie = getCookie(NOTE_ITEMS_KEY, { req, res })
  if (cookie) return JSON.parse(cookie as string) as NoteSummaryModel[]
  else return []
}

export const setNoteItemsFromCookie = (data: NoteSummaryModel[], { req, res }: ServerSideOpt): void => {
  setCookie(NOTE_ITEMS_KEY, data, { req, res })
}

export const removeNoteItemsFromCookie = ({ req, res }: ServerSideOpt): void => {
  deleteCookie(NOTE_ITEMS_KEY, { req, res })
}
