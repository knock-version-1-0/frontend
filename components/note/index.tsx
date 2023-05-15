import React, {
  useCallback,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react"

import { NoteEntity } from "@/models/notes.model"
import { NoteContext } from "@/contexts/note.context"
import { NoteAppContext } from "@/contexts/apps.context"
import { NoteStatusEnum, BlockStatusEnum } from "@/constants/note.constant"
import { useNoteScreenPosition, useNoteStatus } from "@/hooks/note/note.hook"
import { KeywordEntity } from "@/models/notes.model"
import { KeywordData } from "@/api/data/notes"
import { NoteNameDuplicate } from "@/api/status"
import { NOTE_NAME_LENGTH_LIMIT } from "@/constants/note.constant"
import { useKeywordList } from "@/hooks/apps/notes.hook"

import Block from "./Block"
import Toolbar from "./Toolbar"
import Info from "../Info"
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import clsx from "@/utils/clsx.util"

interface NoteProps {
  note: NoteEntity
}

const Note: React.FC<NoteProps> = ({note}) => {
  const noteElementRef = useRef<HTMLDivElement>(null)

  const { screenX, screenY } = useNoteScreenPosition(noteElementRef)
  const { noteStatus, setNoteStatus } = useNoteStatus(NoteStatusEnum.EXIT)
  const { items: keywords, modifyItem, addItem } = useKeywordList(note.keywords, note.id)

  useEffect(() => {
    if (noteStatus === NoteStatusEnum.EXIT) {
      noteElementRef.current?.focus()
    }
  }, [noteStatus])

  const handleCreateKeyword = useCallback((data: KeywordData) => {
    setNoteStatus(NoteStatusEnum.EXIT)
  }, [])

  const InitKeywordModel: KeywordEntity = {
    noteId: note.id,
    posX: 0,
    posY: 0,
    text: '',
    parentId: null,
    status: BlockStatusEnum.UNSELECT,
    timestamp: Date.now()
  }

  const [PhantomKeywordModel, setPhantomKeywordModel] = useState<KeywordEntity>(InitKeywordModel)

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      if (noteStatus === NoteStatusEnum.TITLEMOD) {
        if (event.nativeEvent.isComposing) return
        setNoteStatus(NoteStatusEnum.EXIT)
      }
      else if (noteStatus === NoteStatusEnum.KEYADD || noteStatus === NoteStatusEnum.KEYMOD) {
        if (event.nativeEvent.isComposing) return
        setNoteStatus(NoteStatusEnum.EXIT)
      }
      else {
        setNoteStatus(NoteStatusEnum.EXIT)
      }
    }
    else if (event.key === "Enter") {
      if (noteStatus === NoteStatusEnum.EXIT) {
        setNoteStatus(NoteStatusEnum.KEYADD)
      }
      else if (noteStatus === NoteStatusEnum.TITLEMOD) {
        if (event.nativeEvent.isComposing) return
        setNoteStatus(NoteStatusEnum.EXIT)
      }
      else if (noteStatus === NoteStatusEnum.KEYADD || noteStatus === NoteStatusEnum.KEYMOD) {
        if (event.nativeEvent.isComposing) return
        setNoteStatus(NoteStatusEnum.EXIT)
      }
    }
  }, [noteStatus, setNoteStatus])

  return (
    <NoteContext.Provider value={{
      noteStatus,
      setNoteStatus
    }}>
      <div className="w-full h-full bg-zinc-50 focus:outline-none" ref={noteElementRef}
        onMouseMove={(e) => {
          PhantomKeywordModel && setPhantomKeywordModel({
            ...PhantomKeywordModel,
            posX: e.clientX as number,
            posY: e.clientY as number
          })
        }}
        onKeyDown={(e) => {handleKeyDown(e)}}
        tabIndex={0}
      >
        <div className="hidden md:block mx-10">
          <Title note={note}></Title>
          {
            keywords.length === 0 ? (
              noteStatus !== NoteStatusEnum.KEYADD && (
              <div className="mt-56 mr-20 flex flex-col items-center text-3xl font-bold text-zinc-300 cursor-default">
                <p>Press [Enter] to create</p>
                <p>keyword</p>
              </div>
            )) : (
              keywords.map((value, index) => (
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
            onCreateKeyword={() => setNoteStatus(NoteStatusEnum.KEYADD)}
          ></Toolbar>
        </div>
      </div>
    </NoteContext.Provider>
  )
}

const Title = ({ note }: {note: NoteEntity}): JSX.Element => {
  const { modifyItem } = useContext(NoteAppContext)
  const { noteStatus, setNoteStatus } = useContext(NoteContext)

  const [noteName, setNoteName] = useState<string>(note.name)
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false)

  const [noteItem, setNoteItem] = useState<NoteEntity>(note)

  useEffect(() => {
    setNoteName(note.name)
    setNoteItem(note)
  }, [note])

  useEffect(() => {
    setIsDuplicate(false)
  }, [isDuplicate])

  const titleElementRef = useRef<HTMLInputElement>(null)

  const handleBlur = useCallback(async () => {
    await submitNoteTitle(noteName)
  }, [noteItem, noteName, noteStatus])

  const submitNoteTitle = useCallback(async (name: string) => {
    const hookReturn = await modifyItem({
      name: name
    }, noteItem.displayId)

    if (hookReturn.isSuccess) {
      const data = hookReturn.data as NoteEntity
      setNoteItem(data)
      setNoteName(data.name)
    } else if (hookReturn.status === NoteNameDuplicate) {
      setIsDuplicate(true)
    }
  }, [noteItem])

  return (
    <>
      <nav className="mt-5 text-md">
        <span className="text-knock-sub underline cursor-pointer hover:opacity-70">{noteItem.name === '' ? '_' : noteItem.name}</span>
        <span className="mx-2">/</span>
      </nav>
      <div className="flex flex-row items-end mt-4">
        <div className="border-b border-black w-[284px] cursor-text">
          <input className="w-full text-2xl outline-none bg-transparent"
            ref={titleElementRef}
            value={noteName}
            onBlur={handleBlur}
            onFocus={() => {setNoteStatus!(NoteStatusEnum.TITLEMOD)}}
            onChange={(e) => {
              setNoteName(e.target.value)
            }}
            maxLength={NOTE_NAME_LENGTH_LIMIT}
          />
        </div>
        <ModeEditIcon></ModeEditIcon>
        <Info
          text={'! Note name is duplicated'}
          trigger={isDuplicate}
          className="ml-2"
        ></Info>
      </div>
    </>
  )
}

export default Note
