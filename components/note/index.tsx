import React, { useCallback, useRef, useState, useEffect } from "react"

import { NoteEntity } from "@/models/notes.model"
import { NoteContext } from "@/contexts/note.context"
import { useNoteStatus, NoteStatus } from "@/hooks/note/keycontrol.hook"
import { NoteStatusChoice } from "@/constants/note.constant"
import { useNoteScreenPosition, usePhantomState } from "@/hooks/note/note.hook"

import Block, { KeywordEntity, KeywordData } from "./Block"
import Toolbar from "./Toolbar"
import ModeEditIcon from '@mui/icons-material/ModeEdit'

const Note = ({note}: {note: NoteEntity}): JSX.Element => {
  const noteElementRef = useRef<HTMLDivElement>(null)

  const { screenX, screenY } = useNoteScreenPosition(noteElementRef)

  const { noteStatus, setNoteStatus } = useNoteStatus()

  const { hasPhantom, setHasPhantom } = usePhantomState()

  useEffect(() => {

  }, [])

  const handleCreateKeyword = useCallback((data: KeywordData) => {
    setNoteStatus(NoteStatusChoice.EXIT)
    setHasPhantom(false)
  }, [])

  const InitKeywordModel: KeywordEntity = {
    noteId: note.id,
    posX: 0,
    posY: 0,
    text: '',
    children: [],
    status: null
  }

  const [PhantomKeywordModel, setPhantomKeywordModel] = useState<KeywordEntity>(InitKeywordModel)

  return (
    <NoteContext.Provider value={{
      noteStatus: noteStatus,
      setNoteStatus: setNoteStatus
    }}>
      <div className="w-full h-full bg-zinc-50" ref={noteElementRef}
        onMouseMove={(e) => {
          PhantomKeywordModel && setPhantomKeywordModel({
            ...PhantomKeywordModel,
            posX: e.clientX as number,
            posY: e.clientY as number
          })
        }}
      >
        <div className="ml-10">
          <nav className="text-md mt-4 py-1 text-knock-sub underline cursor-pointer hover:opacity-70">{note.name}</nav>
          <div className="flex flex-row items-end mt-4">
            <div className="border-b border-black w-[240px] cursor-text">
              <h1 className="text-2xl">{note.name}</h1>
            </div>
            <ModeEditIcon></ModeEditIcon>
          </div>
          <Block
            keyword={ InitKeywordModel }
            config={{
              screenX,
              screenY,
              phantom: false,
            }}
            onUpdate={(data: KeywordData) => {}}
          ></Block>
          {
            hasPhantom &&
            <Block
              keyword={ PhantomKeywordModel }
              config={{
                screenX,
                screenY,
                phantom: hasPhantom,
              }}
              onUpdate={(data: KeywordData) => {}}
              onCreate={(data: KeywordData) => handleCreateKeyword(data)}
            ></Block>
          }
          <Toolbar></Toolbar>
        </div>
      </div>
    </NoteContext.Provider>
  )
}

export default Note
