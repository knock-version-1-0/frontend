import { useState, useEffect } from 'react'

export interface ExitState {
  exit: boolean
  setExit: React.Dispatch<React.SetStateAction<boolean>>
}

export const useExitState = (): ExitState => {
  const [exit, setExit] = useState<boolean>(true)
  
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExit(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return { exit, setExit }
}
