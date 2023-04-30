import { useState, useEffect } from 'react'

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
