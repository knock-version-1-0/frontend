import { StatusChoice } from "@/utils/enums.util";

export interface NoteEntity {
  id: number;
  displayId: string;
  authorId: number;
  name: string;
  status: StatusChoice;
  keywords: KeywordEntity[];
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
