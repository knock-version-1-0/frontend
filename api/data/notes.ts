export interface NoteData {
  name?: string
  status?: number
  keywords?: KeywordData[]
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
