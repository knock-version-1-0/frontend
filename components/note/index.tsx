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
import { NoteStatusEnum, KeywordStatusEnum } from "@/constants/note.constant"
import { useNoteScreenPosition, useNoteStatus } from "@/hooks/note/note.hook"
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

  const handleCreateKeyword = useCallback((data: KeywordData) => {
    setNoteStatus!(NoteStatusEnum.EXIT)
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
        <div className="mx-10">
          <Title note={note}></Title>
          {
            note.keywords.length === 0 ? (
              <div className="mt-56 flex flex-col justify-center items-center text-3xl font-bold text-zinc-300">
                <p>Press [Enter] to create</p>
                <p>keyword</p>
              </div>
            ) : (
              note.keywords.map((value, index) => (
                <Block
                  key={ index }
                  keyword={ value }
                  screenX={ screenX }
                  screenY={ screenY }
                  onUpdate={(data: KeywordData) => {}}
                ></Block>
              ))
            )
          }
          {
            noteStatus === NoteStatusEnum.KEYADD &&
            <Block
              keyword={ PhantomKeywordModel }
              screenX={ screenX }
              screenY={ screenY }
              onUpdate={(data: KeywordData) => {}}
              onCreate={(data: KeywordData) => handleCreateKeyword(data)}
            ></Block>
          }
          <Toolbar
            onCreateKeyword={() => setNoteStatus!(NoteStatusEnum.KEYADD)}
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

  useEffect(() => {
    setIsDuplicate(false)
  }, [isDuplicate])

  const isSubmit = useRef<boolean>(false)
  const titleElementRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && titleElementRef.current) {
      titleElementRef.current.blur()
    }
    else if (e.key === 'Escape' && titleElementRef.current) {
      titleElementRef.current.blur()
    }
  }, [value, item])

  const handleBlur = useCallback(async () => {
    await submitNoteTitle()

    if (!isSubmit.current) {
      setValue(item.name)
    } else {
      setItem({...item, name: value})
    }
    isSubmit.current = false
  }, [item, value])

  const submitNoteTitle = useCallback(async () => {
    const hookReturn = await modifyItem(item.displayId, {
      name: value
    })

    if (hookReturn.isSuccess) {
      isSubmit.current = true
    } else if (hookReturn.status === NoteNameDuplicate) {
      isSubmit.current = false
      setIsDuplicate(true)
    }
  }, [item, value])

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
