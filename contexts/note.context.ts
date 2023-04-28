import { createContext } from "react"

import { NoteSummaryEntity } from "@/models/notes.model"
import { NoteStore } from "@/stores/note.store"
import { NoteStatusChoice } from "@/constants/note.constant"

export const NoteContext = createContext<NoteStore>({
    noteStatus: NoteStatusChoice.EXIT,
    setNoteStatus: null
})
