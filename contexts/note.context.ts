import { createContext } from "react"

import { NoteSummaryEntity } from "@/models/notes.model"
import { NoteStore } from "@/stores/note.store"
import { BlockStatusEnum, NoteStatusEnum } from "@/constants/note.constant"

export const NoteContext = createContext<NoteStore>({
    noteStatus: NoteStatusEnum.EXIT,
    setNoteStatus: null,
    blockStatus: BlockStatusEnum.UNSELECT,
    setBlockStatus: null
})
