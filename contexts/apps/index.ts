import { createContext } from "react";

import {
  AppStore,
  InitAppStore,
  NoteListAppStore,
  InitNoteListAppStore,  
  KeywordListAppStore,
  InitKeywordListAppStore
} from "@/stores/apps";

export const AppContext = createContext<AppStore>(InitAppStore);
export const NoteAppContext = createContext<NoteListAppStore>(InitNoteListAppStore);
export const KeywordAppContext = createContext<KeywordListAppStore>(InitKeywordListAppStore);
