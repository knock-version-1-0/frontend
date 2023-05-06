import { KeywordEntity, NoteSummaryEntity } from "@/models/notes.model";
import { KeywordData, NoteData } from "@/api/data/notes";
import { ItemStore, HookCallbackReturn } from "@/utils/types.util"

import { DebouncedFunc, debounce } from 'lodash'

export interface NoteListAppStore extends ItemStore<NoteSummaryEntity[], NoteData, string> {
  items: NoteSummaryEntity[]
  next: () => void
  search: DebouncedFunc<(name: string) => void>
  isLast: boolean
  addItem: (data: NoteData) => Promise<HookCallbackReturn>
  modifyItem: (key: string, data: NoteData) => Promise<HookCallbackReturn>
  removeItem: (key: string) => Promise<HookCallbackReturn>
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

export interface KeywordListAppStore extends ItemStore<KeywordEntity[], KeywordData, number> {
  addItem: (data: KeywordData) => void
  modifyItem: (key: number, data: KeywordData) => void
}
