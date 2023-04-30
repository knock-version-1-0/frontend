import { createContext } from "react"

import {
  AppStore,
  InitAppStore,
  NoteListAppStore,
  InitNoteListAppStore  
} from "@/stores/apps"

export const AppContext = createContext<AppStore>(InitAppStore)
export const NoteAppContext = createContext<NoteListAppStore>(InitNoteListAppStore)
