import { createContext } from "react"

import {
  AppStore,
  InitAppStore,
  NoteListAppStore,
  InitNoteListAppStore  
} from "@/stores/apps.store"

export const AppContext = createContext<AppStore>(InitAppStore)
export const NoteAppContext = createContext<NoteListAppStore>(InitNoteListAppStore)
