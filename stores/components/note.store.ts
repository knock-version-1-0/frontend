import { BlockStatusEnum, NoteStatusEnum } from "@/constants/notes.constant"

export interface NoteStore {
  noteStatus: NoteStatusEnum;
  setNoteStatus: React.Dispatch<React.SetStateAction<NoteStatusEnum>> | null;
  blockStatus: BlockStatusEnum;
  setBlockStatus: React.Dispatch<React.SetStateAction<BlockStatusEnum>> | null;
}
