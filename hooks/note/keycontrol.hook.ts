import { useState, useEffect } from 'react'

import { NoteStatusChoice } from '@/constants/note.constant'

export interface NoteStatus {
  noteStatus: NoteStatusChoice
  setNoteStatus: React.Dispatch<React.SetStateAction<NoteStatusChoice>>
}

export const useNoteStatus = (): NoteStatus => {
  const [noteStatus, setNoteStatus] = useState<NoteStatusChoice>(NoteStatusChoice.EXIT)
  
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNoteStatus(NoteStatusChoice.EXIT)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return { noteStatus, setNoteStatus }
}
