import { BlockStatusEnum, NoteStatusEnum } from "@/constants/note.constant"

export interface NoteStore {
  noteStatus: NoteStatusEnum
  setNoteStatus: React.Dispatch<React.SetStateAction<NoteStatusEnum>> | null
  blockStatus: BlockStatusEnum
  setBlockStatus: React.Dispatch<React.SetStateAction<BlockStatusEnum>> | null
}
