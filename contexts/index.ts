import { createContext } from "react"

import { NoteSummaryModel } from "@/models/notes.model"

export const NoteItemsContext = createContext<NoteSummaryModel[]>([])
