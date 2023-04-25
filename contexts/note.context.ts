import { createContext } from "react"

import { NoteSummaryEntity } from "@/models/notes.model"
import { NoteStore } from "@/stores/note.store"

export const NoteContext = createContext<NoteStore>({})
