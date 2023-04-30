import React, { useCallback, useRef, useState } from "react"

import { NoteEntity } from "@/models/notes.model"
import { NoteContext } from "@/contexts/note.context"
import { useNoteStatus } from "@/hooks/note/keycontrol.hook"
import { NoteStatusEnum, KeywordStatusEnum } from "@/constants/note.constant"
import { useNoteScreenPosition, usePhantomState } from "@/hooks/note/note.hook"
import { KeywordEntity } from "@/models/notes.model"
import { KeywordData } from "@/api/data/notes"

import Block from "./Block"
import Toolbar from "./Toolbar"
import ModeEditIcon from '@mui/icons-material/ModeEdit'

const Note = ({note}: {note: NoteEntity}): JSX.Element => {
  const noteElementRef = useRef<HTMLDivElement>(null)

  const { screenX, screenY } = useNoteScreenPosition(noteElementRef)

  const { noteStatus, setNoteStatus } = useNoteStatus()

  const { hasPhantom, setHasPhantom } = usePhantomState()

  const handleCreateKeyword = useCallback((data: KeywordData) => {
    setNoteStatus(NoteStatusEnum.EXIT)
    setHasPhantom(false)
  }, [])

  const InitKeywordModel: KeywordEntity = {
    noteId: note.id,
    posX: 0,
    posY: 0,
    text: '',
    parentId: null,
    status: KeywordStatusEnum.UNSELECT,
    timestamp: Date.now()
  }

  const [PhantomKeywordModel, setPhantomKeywordModel] = useState<KeywordEntity>(InitKeywordModel)

  return (
    <NoteContext.Provider value={{
      noteStatus,
      setNoteStatus
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
          <nav className="mt-5 text-md">
            <span className="text-knock-sub underline cursor-pointer hover:opacity-70">{note.name === '' ? '_' : note.name}</span>
            <span className="mx-2">/</span>
          </nav>
          <div className="flex flex-row items-end mt-4">
            <div className="border-b border-black w-[240px] cursor-text">
              <input className="text-2xl outline-none bg-transparent note-title-input-style"
                value={note.name}
                onChange={() => {}}
              />
            </div>
            <ModeEditIcon></ModeEditIcon>
          </div>
          {/** note.keywords.map */}
          <Block
            keyword={ InitKeywordModel }
            config={{
              screenX,
              screenY,
              phantom: false,
            }}
            onUpdate={(data: KeywordData) => {}}
          ></Block>
          {/** --------------------------------- */}
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
          <Toolbar
            onCreateKeyword={() => setHasPhantom(true)}
          ></Toolbar>
        </div>
      </div>
    </NoteContext.Provider>
  )
}

export default Note
