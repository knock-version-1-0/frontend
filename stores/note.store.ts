import { NoteStatusChoice } from "@/constants/note.constant"

export interface NoteStore {
  noteStatus: NoteStatusChoice
  setNoteStatus: React.Dispatch<React.SetStateAction<NoteStatusChoice>> | null
}
