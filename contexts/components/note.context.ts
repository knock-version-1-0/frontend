import { createContext } from "react";

import { NoteSummaryEntity } from "@/models/notes.model";
import { NoteStore } from "@/stores/components/note.store";
import { BlockStatusEnum, NoteStatusEnum } from "@/constants/notes.constant";

export const NoteContext = createContext<NoteStore>({
    noteStatus: NoteStatusEnum.EXIT,
    setNoteStatus: null,
});
