import { useState, useCallback, useContext } from "react"

import { AppContext } from "@/contexts/apps.context"
import { NoteSummaryEntity } from "@/models/notes.model"
import { ApiPostNotes, ApiGetNotes } from "@/api/notes.api"
import { NoteData } from "@/api/data/notes"
import { NoteListAppStore } from "@/stores/apps.store"
import { MAX_NOTE_LIST_SIZE } from "@/constants/note.constant"

export const useNoteList = (init: NoteSummaryEntity[]): NoteListAppStore => {
  const { token } = useContext(AppContext)

  const [items, setItems] = useState<NoteSummaryEntity[]>(init)
  const [offset, setOffset] = useState<number>(0)
  const [isLast, setIsLast] = useState<boolean>(false)

  const next = useCallback(async () => {
    const nextOffset = offset + MAX_NOTE_LIST_SIZE
    setOffset(nextOffset)

    const data = await ApiGetNotes({
      offset: nextOffset
    }, token ?? '')

    if (data) {
      if (data.length === 0) {
        setIsLast(true)
      }
      else if (data.length >= 0 && data.length < MAX_NOTE_LIST_SIZE) {
        setItems([...items, ...data])
        setIsLast(true)
      } else {
        setItems([...items, ...data])
      }
    }
  }, [offset, items])
  
  const addNote = useCallback(async (data: NoteData) => {
    const note = await ApiPostNotes(data, token as string)
    setItems([{
      displayId: note.displayId,
      name: note.name
    }, ...items])
  }, [items])

  const modifyNote = useCallback(async (data: NoteData) => {}, [])

  const removeNote = useCallback(async () => {}, [])

  return {
    items,
    isLast,
    next,
    addNote,
    modifyNote,
    removeNote
  }
}
