export const NOTE_ITEMS_KEY = 'note/items'
export const NOTE_OFFSET_KEY = 'note/offset'
export const MAX_NOTE_LIST_SIZE = 12
export const NOTE_NAME_LENGTH_LIMIT = 25

export enum NoteStatusEnum {
  EXIT=1,
  KEYMOD,
  KEYADD,
  REL
}

export enum KeywordStatusEnum {
  UNSELECT=1,
  SELECT,
  EDIT
}
