import { createContext } from "react"

import { NoteSummaryModel } from "@/models/notes.model"
import { UserModel } from "@/models/users.model"

export interface ContextValue {
    noteItems: NoteSummaryModel[]
    token?: string
}

export const InitContextValue: ContextValue = {
    noteItems: [],
    token: undefined
}

export const AppContextApi = createContext<ContextValue>(InitContextValue)
