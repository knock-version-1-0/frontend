import { useState, useCallback, useContext, useEffect } from "react"
import { useRouter } from "next/router"

import { AppContext } from "@/contexts/apps.context"
import { NoteSummaryEntity, NoteEntity } from "@/models/notes.model"
import { ApiPostNotes, ApiGetNotes, ApiDeleteNote } from "@/api/notes.api"
import { NoteData } from "@/api/data/notes"
import { NoteListAppStore } from "@/stores/apps.store"
import { MAX_NOTE_LIST_SIZE } from "@/constants/note.constant"
import { NoteNameDuplicate } from "@/utils/status.util"
import { ApiPayload } from "@/utils/types.util"

export const useNoteList = (init: NoteSummaryEntity[]): NoteListAppStore => {
  const router = useRouter()
  const { token } = useContext(AppContext)

  const [items, setItems] = useState<NoteSummaryEntity[]>(init)
  const [offset, setOffset] = useState<number>(0)
  const [isLast, setIsLast] = useState<boolean>(false)

  const next = useCallback(async () => {
    const nextOffset = offset + MAX_NOTE_LIST_SIZE
    setOffset(nextOffset)

    const payload: ApiPayload = await ApiGetNotes({
      offset: nextOffset
    }, token ?? '')
    if (payload.status === 'OK') {
      const data = payload.data
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
    }
  }, [offset, items])
  
  const addItem = useCallback(async (data: NoteData) => {
    const payload: ApiPayload = await ApiPostNotes(data, token as string)
    if (payload.status === NoteNameDuplicate) {
      return
    }

    const note: NoteEntity = payload.data
    router.replace(`/note/${note.displayId}`)
    setItems([{
      displayId: note.displayId,
      name: note.name
    }, ...items])
  }, [items])

  const modifyItem = useCallback(async (data: NoteData) => {}, [])

  const removeItem = useCallback(async (displayId: string) => {
    const newItems = items.filter((value) => value.displayId !== displayId)
    if (newItems.length !== 0) {
      router.replace(`/note/${newItems[0].displayId}`)
    } else { router.replace(`/note`) }
    ApiDeleteNote(displayId, token as string)
    setItems(newItems)
  }, [items])

  return {
    items,
    isLast,
    next,
    addItem,
    modifyItem,
    removeItem
  }
}
