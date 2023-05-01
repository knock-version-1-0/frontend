import React, {
  useCallback,
  useRef,
  useState,
  useContext,
  useEffect
} from "react"

import { NoteEntity } from "@/models/notes.model"
import { NoteContext } from "@/contexts/note.context"
import { NoteAppContext } from "@/contexts/apps.context"
import { useNoteStatus } from "@/hooks/note/keycontrol.hook"
import { NoteStatusEnum, KeywordStatusEnum } from "@/constants/note.constant"
import { useNoteScreenPosition, usePhantomState } from "@/hooks/note/note.hook"
import { KeywordEntity } from "@/models/notes.model"
import { KeywordData } from "@/api/data/notes"
import { NoteNameDuplicate } from "@/api/status"
import { NOTE_NAME_LENGTH_LIMIT } from "@/constants/note.constant"

import Block from "./Block"
import Toolbar from "./Toolbar"
import Info from "../Info"
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import clsx from "@/utils/clsx.util"

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
          <Title note={note}></Title>
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

const Title = ({ note }: {note: NoteEntity}): JSX.Element => {
  const { modifyItem } = useContext(NoteAppContext)

  const [value, setValue] = useState<string>(note.name)
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false)

  const [item, setItem] = useState<NoteEntity>(note)

  useEffect(() => {
    setValue(note.name)
    setItem(note)
  }, [note])

  const isSubmit = useRef<boolean>(false)
  const titleElementRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = useCallback(async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && titleElementRef.current) {
      const hookReturn = await modifyItem(item.displayId, {
        name: value
      })
      if (hookReturn.isSuccess) {
        isSubmit.current = true
        setItem({...item, name: value})
      } else if (hookReturn.status === NoteNameDuplicate) {
        setIsDuplicate(true)
      }
      titleElementRef.current.blur()
    }
    else if (e.key === 'Escape' && titleElementRef.current) {
      titleElementRef.current.blur()
    }
  }, [value, item])

  const handleBlur = useCallback(() => {
    if (!isSubmit.current) {
      setValue(item.name)
    }
    isSubmit.current = false
  }, [item])

  return (
    <>
      <nav className="mt-5 text-md">
        <span className="text-knock-sub underline cursor-pointer hover:opacity-70">{item.name === '' ? '_' : item.name}</span>
        <span className="mx-2">/</span>
      </nav>
      <div className="flex flex-row items-end mt-4">
        <div className="border-b border-black w-[284px] cursor-text">
          <input className="w-full text-2xl outline-none bg-transparent note-title-input-style"
            ref={titleElementRef}
            value={value}
            onBlur={handleBlur}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            maxLength={NOTE_NAME_LENGTH_LIMIT}
          />
        </div>
        <ModeEditIcon></ModeEditIcon>
        <Info
          text={'! Note name is duplicated'}
          trigger={isDuplicate}
        ></Info>
      </div>
    </>
  )
}

export default Note
