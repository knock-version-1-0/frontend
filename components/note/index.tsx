import React, { useState, useEffect, useCallback, useRef } from "react"

import { NoteModel } from "@/models/notes.model"

import Block from "./Block"
import Toolbar from "./Toolbar"
import ModeEditIcon from '@mui/icons-material/ModeEdit'

const Note = ({note}: {note: NoteModel}): JSX.Element => {
  const noteElementRef = useRef<HTMLDivElement>(null)

  const [screenX, setScreenX] = useState<number|undefined>()
  const [screenY, setScreenY] = useState<number|undefined>()

  const getPosition = () => {
    const x = noteElementRef.current?.offsetLeft
    const y = noteElementRef.current?.offsetTop

    setScreenX(x); setScreenY(y)
  }
  
  useEffect(() => {
    getPosition()
  }, [])

  useEffect(() => {
    window.addEventListener("resize", getPosition);
  }, []);

  return (
    <div className="w-full h-full bg-zinc-50" ref={noteElementRef}>
      <div className="ml-10">
        <nav className="text-md mt-4 py-1 text-knock-sub underline cursor-pointer hover:opacity-70">{note.name}</nav>
        <div className="flex flex-row items-end mt-4">
          <div className="border-b border-black w-[240px] cursor-text">
            <h1 className="text-2xl">{note.name}</h1>
          </div>
          <ModeEditIcon></ModeEditIcon>
        </div>
        <Block
          config={{
            screenX,
            screenY
          }}
          onSubmit={() => {}}
        ></Block>
        <Toolbar></Toolbar>
      </div>
    </div>
  )
}

export default Note
