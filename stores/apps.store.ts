import { NoteSummaryEntity } from "@/models/notes.model";
import { NoteData } from "@/api/data/notes";

export interface AppStore {
  token?: string
}

export const InitAppStore: AppStore = {
  token: undefined
}

export interface ItemStore {
  items: any
  addItem: (data: any) => void
  modifyItem: (data: any) => void
  removeItem: (key: any) => void
}

export interface NoteListAppStore extends ItemStore {
  items: NoteSummaryEntity[]
  next: () => void
  isLast: boolean
  addItem: (data: NoteData) => void
  modifyItem: (data: NoteData) => void
  removeItem: (displayId: string) => void
}

export const InitNoteListAppStore: NoteListAppStore = {
  items: [],
  next: () => {},
  isLast: false,
  addItem: (data: NoteData) => {},
  modifyItem: (data: NoteData) => {},
  removeItem: (displayId: string) => {}
}
