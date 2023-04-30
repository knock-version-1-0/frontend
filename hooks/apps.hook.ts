import { useState, useCallback, useContext, useEffect } from "react"
import { useRouter } from "next/router"

import { AppContext } from "@/contexts/apps.context"
import { NoteSummaryEntity, NoteEntity } from "@/models/notes.model"
import { fetchPostNotesApi, fetchGetNotesApi, fetchDeleteNoteApi } from "@/api/notes.api"
import { NoteData } from "@/api/data/notes"
import { NoteListAppStore } from "@/stores/apps"
import { MAX_NOTE_LIST_SIZE } from "@/constants/note.constant"
import { NoteNameDuplicate } from "@/api/status"

export const useNoteList = (init: NoteSummaryEntity[]): NoteListAppStore => {
  const router = useRouter()
  const { token } = useContext(AppContext)

  const [items, setItems] = useState<NoteSummaryEntity[]>(init)
  const [offset, setOffset] = useState<number>(0)
  const [isLast, setIsLast] = useState<boolean>(false)

  const next = useCallback(async () => {
    const nextOffset = offset + MAX_NOTE_LIST_SIZE
    setOffset(nextOffset)

    const payload = await fetchGetNotesApi({
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
    const payload = await fetchPostNotesApi(data, token as string)
    if (payload.status === NoteNameDuplicate) {
      return
    }

    const note: NoteEntity = payload.data!
    router.replace(`/note/${note.displayId}`)
    setItems([{
      displayId: note.displayId,
      name: note.name
    }, ...items])
  }, [items])

  const modifyItem = useCallback(async (data: NoteData) => {}, [])

  const removeItem = useCallback(async (key: string) => {
    const newItems = items.filter((value) => value.displayId !== key)
    if (newItems.length !== 0) {
      router.replace(`/note/${newItems[0].displayId}`)
    } else { router.replace(`/note`) }

    await fetchDeleteNoteApi(key, token as string)

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
