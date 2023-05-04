import { useState, useEffect } from "react"

import { NoteStatusEnum } from '@/constants/note.constant'

export interface NoteStatus {
  noteStatus: NoteStatusEnum
  setNoteStatus: React.Dispatch<React.SetStateAction<NoteStatusEnum>>
}

export const useNoteStatus = (): NoteStatus => {
  const [noteStatus, setNoteStatus] = useState<NoteStatusEnum>(NoteStatusEnum.EXIT)
  
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNoteStatus(NoteStatusEnum.EXIT)
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

interface PhantomState {
  hasPhantom: boolean
  setHasPhantom: React.Dispatch<React.SetStateAction<boolean>>
}

export const usePhantomState = (): PhantomState => {
  const [hasPhantom, setHasPhantom] = useState(false)
  return { hasPhantom, setHasPhantom }
}
