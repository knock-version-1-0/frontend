import { KeywordEntity, NoteEntity, NoteSummaryEntity } from "@/models/notes.model";
import { KeywordData, NoteData } from "@/api/data/notes";
import { ItemStore, HookCallbackReturn } from "@/utils/types.util";

import { DebouncedFunc, debounce } from 'lodash';

export interface NoteListAppStore extends ItemStore<NoteSummaryEntity, NoteData, string> {
  items: NoteSummaryEntity[];
  nextPage: () => void;
  search: DebouncedFunc<(name: string) => void>;
  isLast: boolean;
  addItem: (data: NoteData) => Promise<HookCallbackReturn<NoteEntity>>;
  modifyItem: (data: NoteData, key: string) => Promise<HookCallbackReturn<NoteEntity>>;
  removeItem: (key: string) => Promise<HookCallbackReturn<NoteEntity>>;
}

export const InitNoteListAppStore: NoteListAppStore = {
  items: [],
  nextPage: () => { },
  search: debounce((name: string) => { }),
  isLast: false,
  addItem: (data: NoteData) => Promise.resolve({
    isSuccess: false,
    status: ''
  }),
  modifyItem: (data: NoteData, key: string) => Promise.resolve({
    isSuccess: false,
    status: ''
  }),
  removeItem: (key: string) => Promise.resolve({
    isSuccess: false,
    status: ''
  })
}

export interface KeywordListAppStore extends ItemStore<KeywordEntity, KeywordData, number> {
  items: KeywordEntity[];
  addItem: (data: KeywordData) => Promise<void>;
  modifyItem: (data: KeywordData, key: number) => Promise<void>;
  removeItem: (key: number) => Promise<void>;
}

export const InitKeywordListAppStore: KeywordListAppStore = {
  items: [],
  addItem: (data: KeywordData) => Promise.resolve(),
  modifyItem: (data: NoteData, key: number) => Promise.resolve(),
  removeItem: (key: number) => Promise.resolve()
}
