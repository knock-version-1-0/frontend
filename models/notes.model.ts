import { StatusChoice } from "@/utils/enums.util";
import { generateUUID } from "@/utils";

export interface NoteEntity {
  id: number;
  displayId: string;
  authorId: number;
  name: string;
  status: StatusChoice;
  keywords: KeywordEntity[];
}

export const InitNoteEntity: NoteEntity = {
  id: 1,
  displayId: generateUUID(),
  authorId: 0,
  name: 'Tutorial',
  status: StatusChoice.SAVE,
  keywords: []
}

export interface KeywordEntity {
  id?: number;
  noteId: number;
  posX: number;
  posY: number;
  text: string;
  parentId: number | null;
  status: number;
  timestamp: number;
}

export interface NoteSummaryEntity {
  displayId: string;
  name: string;
}
