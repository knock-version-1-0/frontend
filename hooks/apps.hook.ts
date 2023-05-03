import { useState, useCallback, useContext, useEffect } from "react"
import { useRouter } from "next/router"

import { AppContext } from "@/contexts/apps.context"
import { NoteSummaryEntity, NoteEntity } from "@/models/notes.model"
import {
  fetchPostNotesApi,
  fetchGetNotesApi,
  fetchDeleteNoteApi,
  fetchPatchNoteApi
} from "@/api/notes.api"
import { NoteData } from "@/api/data/notes"
import { NoteListAppStore } from "@/stores/apps"
import { MAX_NOTE_LIST_SIZE } from "@/constants/note.constant"
import { NoteDoesNotExist, NoteNameDuplicate } from "@/api/status"

import { debounce } from "lodash"

export const useNoteList = (init: NoteSummaryEntity[]): NoteListAppStore => {
  const router = useRouter()
  const { token } = useContext(AppContext)

  const [items, setItems] = useState<NoteSummaryEntity[]>(init)
  const [offset, setOffset] = useState<number>(0)
  const [isLast, setIsLast] = useState<boolean>(false)

  useEffect(() => {
    if (items.length < MAX_NOTE_LIST_SIZE) {
      setIsLast(true)
    }
  }, [items])

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
          setIsLast(false)
        }
      }
    }
  }, [offset, items])

  const search = useCallback(debounce(async (name: string) => {
    setOffset(0)

    const payload = await fetchGetNotesApi({
      name: name,
      offset: 0
    }, token ?? '')

    if (payload.status === 'OK') {
      const data = payload.data
      if (data) {
        if (data.length === 0) {
          setIsLast(true)
        }
        else if (data.length >= 0 && data.length < MAX_NOTE_LIST_SIZE) {
          setItems(data)
          setIsLast(true)
        } else {
          setItems(data)
          setIsLast(false)
        }
      }
    }
  }, 250), [items])
  
  const addItem = useCallback(async (data: NoteData) => {
    const payload = await fetchPostNotesApi(data, token as string)

    if (payload.status === NoteNameDuplicate) {
      return {
        isSuccess: false,
        status: NoteNameDuplicate
      }
    }

    const note: NoteEntity = payload.data!
    router.replace(`/note/${note.displayId}`)
    setItems([{
      displayId: note.displayId,
      name: note.name
    }, ...items])

    return {
      isSuccess: true,
      status: payload.status
    }
  }, [items])

  const modifyItem = useCallback(async (key: string, data: NoteData) => {
    const payload = await fetchPatchNoteApi(data, key, token as string)

    if (payload.status === NoteNameDuplicate) {
      return {
        isSuccess: false,
        status: NoteNameDuplicate
      }
    } else if (payload.status === NoteDoesNotExist) {
      return {
        isSuccess: false,
        status: NoteDoesNotExist
      }
    }
    const note: NoteEntity = payload.data!
    setItems(items.map((value) => {
      if (value.displayId === note.displayId) {
        return note
      } else return value
    }))

    return {
      isSuccess: true,
      status: payload.status
    }
  }, [items])

  const removeItem = useCallback(async (key: string) => {
    const newItems = items.filter((value) => value.displayId !== key)

    await fetchDeleteNoteApi(key, token as string)
    router.replace('/note')

    return {
      isSuccess: true,
      status: 'OK'
    }
  }, [items])

  return {
    items,
    isLast,
    next,
    search,
    addItem,
    modifyItem,
    removeItem
  }
}
