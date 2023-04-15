import { StatusChoice } from "@/utils/enums.util"

export interface NoteModel {
  id: number
  displayId: string
  authorId: number
  name: string
  status: StatusChoice
  keywords: KeywordModel[]
}

export interface KeywordModel {
  noteId: number
  posId: number
  text?: string
}

export interface NoteSummaryModel {
  displayId: string
  name: string
}
