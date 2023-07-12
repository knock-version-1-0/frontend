import { NoteStatusEnum } from "@/constants/notes.constant"

export interface NoteStore {
  noteStatus: NoteStatusEnum;
  setNoteStatus: React.Dispatch<React.SetStateAction<NoteStatusEnum>> | null;
  toNoteStatusOf: ((noteStatus: NoteStatusEnum) => void) | null;
}
