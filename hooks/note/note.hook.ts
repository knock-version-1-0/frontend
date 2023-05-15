import { useState, useEffect, useCallback } from "react"

import { NoteStatusEnum, BlockStatusEnum } from '@/constants/note.constant'

export interface NoteState {
  noteStatus: NoteStatusEnum
  setNoteStatus: React.Dispatch<React.SetStateAction<NoteStatusEnum>>
}

export const useNoteStatus = (init: NoteStatusEnum): NoteState => {
  const [noteStatus, setNoteStatus] = useState<NoteStatusEnum>(init)
  
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
  blockStatus: BlockStatusEnum
  setBlockStatus: React.Dispatch<React.SetStateAction<BlockStatusEnum>>
}

export const useBlockStatus = (): KeywordState => {
  const [blockStatus, setBlockStatus] = useState<BlockStatusEnum>(BlockStatusEnum.UNSELECT)

  return {
    blockStatus,
    setBlockStatus
  }
}
