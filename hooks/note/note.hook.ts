import { useState, useEffect } from "react"

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
