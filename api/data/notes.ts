export interface NoteData {
  name?: string
  status?: number
}

export interface NoteFilterData {
  name?: string
  offset?: number
}

export interface KeywordData {
  noteId: number
  posX: number
  posY: number
  text: string
  parentId: number | null
  status: number
  timestamp: number
}
