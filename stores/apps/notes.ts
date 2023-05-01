import { NoteSummaryEntity } from "@/models/notes.model";
import { NoteData } from "@/api/data/notes";
import { ItemStore, CallbackReturn } from "@/utils/types.util"

export interface NoteListAppStore extends ItemStore<NoteSummaryEntity[], NoteData, string> {
    items: NoteSummaryEntity[]
    next: () => void
    isLast: boolean
    addItem: (data: NoteData) => Promise<CallbackReturn>
    modifyItem: (key: string, data: NoteData) => Promise<CallbackReturn>
    removeItem: (key: string) => Promise<CallbackReturn>
  }
  
  export const InitNoteListAppStore: NoteListAppStore = {
    items: [],
    next: () => {},
    isLast: false,
    addItem: (data: NoteData) => Promise.resolve({
      isSuccess: false,
      status: ''
    }),
    modifyItem: (key: string, data: NoteData) => Promise.resolve({
      isSuccess: false,
      status: ''
    }),
    removeItem: (key: string) => Promise.resolve({
      isSuccess: false,
      status: ''
    })
  }
  