import { NoteSummaryEntity } from "@/models/notes.model";
import { NoteData } from "@/api/data/notes";
import { ItemStore, CallbackReturn } from "@/utils/types.util"

import { DebouncedFunc, debounce } from 'lodash'

export interface NoteListAppStore extends ItemStore<NoteSummaryEntity[], NoteData, string> {
  items: NoteSummaryEntity[]
  next: () => void
  search: DebouncedFunc<(name: string) => void>
  isLast: boolean
  addItem: (data: NoteData) => Promise<CallbackReturn>
  modifyItem: (key: string, data: NoteData) => Promise<CallbackReturn>
  removeItem: (key: string) => Promise<CallbackReturn>
}

export const InitNoteListAppStore: NoteListAppStore = {
  items: [],
  next: () => { },
  search: debounce((name: string) => { }),
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
