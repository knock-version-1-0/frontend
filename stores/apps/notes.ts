import { NoteSummaryEntity } from "@/models/notes.model";
import { NoteData } from "@/api/data/notes";
import { ItemStore } from "@/utils/types.util"

export interface NoteListAppStore extends ItemStore<NoteSummaryEntity[], NoteData, string> {
    items: NoteSummaryEntity[]
    next: () => void
    isLast: boolean
    addItem: (data: NoteData) => void
    modifyItem: (data: NoteData) => void
    removeItem: (key: string) => void
  }
  
  export const InitNoteListAppStore: NoteListAppStore = {
    items: [],
    next: () => {},
    isLast: false,
    addItem: (data: NoteData) => {},
    modifyItem: (data: NoteData) => {},
    removeItem: (key: string) => {}
  }
  
