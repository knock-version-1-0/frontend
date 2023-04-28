import { createContext } from "react"

import { NoteSummaryEntity } from "@/models/notes.model"
import { UserModel } from "@/models/users.model"

export interface AppStore {
    noteItems: NoteSummaryEntity[]
    token?: string
}

export const InitAppStore: AppStore = {
    noteItems: [],
    token: undefined
}

export const AppContext = createContext<AppStore>(InitAppStore)
