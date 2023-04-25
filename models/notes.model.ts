import { StatusChoice } from "@/utils/enums.util"

export interface NoteEntity {
  id: number
  displayId: string
  authorId: number
  name: string
  status: StatusChoice
  keywords: KeywordEntity[]
}

export interface KeywordEntity {
  noteId: number
  posId: number
  text?: string
}

export interface NoteSummaryEntity {
  displayId: string
  name: string
}
