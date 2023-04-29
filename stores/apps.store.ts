import { NoteSummaryEntity } from "@/models/notes.model";
import { NoteData } from "@/api/data/notes";

export interface AppStore {
  token?: string
}

export const InitAppStore: AppStore = {
  token: undefined
}

export interface NoteListAppStore {
  items: NoteSummaryEntity[]
  next: () => void
  isLast: boolean
  addNote: (data: NoteData) => void
  modifyNote: (data: NoteData) => void
  removeNote: (displayId: string) => void
}

export const InitNoteListAppStore: NoteListAppStore = {
  items: [],
  next: () => {},
  isLast: false,
  addNote: (data: NoteData) => {},
  modifyNote: (data: NoteData) => {},
  removeNote: (displayId: string) => {}
}
