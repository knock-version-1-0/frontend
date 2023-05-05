import { useState, useEffect, useCallback } from "react"

import { NoteStatusEnum, KeywordStatusEnum } from '@/constants/note.constant'

export interface NoteState {
  noteStatus: NoteStatusEnum
  setNoteStatus: React.Dispatch<React.SetStateAction<NoteStatusEnum>> | null
}

export const useNoteStatus = (): NoteState => {
  const [noteStatus, setNoteStatus] = useState<NoteStatusEnum>(NoteStatusEnum.EXIT)
  
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNoteStatus(NoteStatusEnum.EXIT)
      }
      else if (event.key === "Enter") {
        setNoteStatus(NoteStatusEnum.KEYADD)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return { noteStatus, setNoteStatus }
}

interface NoteScreenPosition {
  screenX: number
  screenY: number
  // setScreenX: React.Dispatch<React.SetStateAction<number | undefined>>
  // setScreenY: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const useNoteScreenPosition = (ref: React.RefObject<HTMLDivElement>): NoteScreenPosition => {
  const [screenX, setScreenX] = useState<number>(0)
  const [screenY, setScreenY] = useState<number>(0)

  const getPosition = () => {
    const x = ref.current?.offsetLeft
    const y = ref.current?.offsetTop

    setScreenX((x??0) + 40); setScreenY((y??0) + 120)
  }
  
  useEffect(() => {
    getPosition()
  }, [])

  useEffect(() => {
    window.addEventListener("resize", getPosition)
  }, [])

  return { screenX, screenY }
}

export interface KeywordState {
  keywordStatus: KeywordStatusEnum
  keywordEditStatusPolicy: () => void
  keywordSelectStatusPolicy: () => void
  keywordUnselectStatusPolicy: () => void
}

export const useKeywordStatus = (noteState: NoteState): KeywordState => {
  const [keywordStatus, setKeywordStatus] = useState<KeywordStatusEnum>(KeywordStatusEnum.UNSELECT)
  const { noteStatus, setNoteStatus } = noteState

  const keywordEditStatusPolicy = useCallback(() => {
    setKeywordStatus(KeywordStatusEnum.EDIT)

    if (noteStatus !== NoteStatusEnum.KEYMOD) {
      setNoteStatus!(NoteStatusEnum.KEYMOD)
    }
  }, [noteStatus])

  const keywordSelectStatusPolicy = useCallback(() => {
    setKeywordStatus(KeywordStatusEnum.SELECT)
  }, [noteStatus])

  const keywordUnselectStatusPolicy = useCallback(() => {
    setKeywordStatus(KeywordStatusEnum.UNSELECT)

    if (noteStatus !== NoteStatusEnum.EXIT) {
      setNoteStatus!(NoteStatusEnum.EXIT)
    }
  }, [noteStatus])

  return {
    keywordStatus,
    keywordEditStatusPolicy,
    keywordSelectStatusPolicy,
    keywordUnselectStatusPolicy
  }
}
