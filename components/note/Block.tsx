import React, { useState, useEffect, useRef, useCallback, useContext, MouseEventHandler } from "react"

import { NoteContext } from "@/contexts/note.context"
import { NoteStatusChoice } from "@/constants/note.constant"

import clsx from "@/utils/clsx.util"

export interface KeywordEntity {
  id?: number
  noteId: number
  posX: number
  posY: number
  text: string
  children: KeywordEntity[]
  parent?: KeywordEntity
  status: null | 'EDIT' | 'READ'
}

export interface KeywordData {
  noteId: number
  posX: number
  posY: number
  text: string
  parentId?: number
  status: null | 'EDIT' | 'READ'
}

interface BlockProps {
  keyword: KeywordEntity
  config: {
    screenX: number
    screenY: number
    phantom: boolean
  }
  onUpdate: (data: KeywordData) => void
  onCreate?: (data: KeywordData) => void
}

const Block = ({ 
  config,
  keyword,
  onUpdate,
  onCreate}: BlockProps): JSX.Element => {
  const elementRef = useRef<HTMLInputElement>(null)

  const { screenX, screenY } = config

  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)

  const [center, setCenter] = useState<Array<number>>([0, 0])

  useEffect(() => {
    if (keyword && screenX !== undefined && screenY !== undefined) {
      setX(screenX + keyword.posX)
      setY(screenY + keyword.posY)
    }
  }, [screenX, screenY, keyword])

  useEffect(() => {
    const height = elementRef.current?.offsetHeight ?? 0
    const width = elementRef.current?.offsetWidth ?? 0
    keyword && setCenter(
      [keyword.posX - (width / 2), keyword.posY - (height / 2)]
    )
  }, [elementRef, keyword])

  const { noteStatus: noteState, setNoteStatus: setNoteState } = useContext(NoteContext)

  return (
    <input type="text" className="absolute w-48 h-[30px] text-center focus:outline-knock-sub border" style={config.phantom ? {
        left: center[0],
        top: center[1]
      } : {
        left: x,
        top: y
      }}
      onFocus={() => {
        if (noteState === NoteStatusChoice.EXIT) {
          setNoteState!(NoteStatusChoice.MOD)
        }
      }}
      onClick={(e) => {
        if (config.phantom) {
          e.preventDefault()
          onCreate && onCreate({
            noteId: keyword.noteId,
            posX: keyword.posX,
            posY: keyword.posY,
            text: keyword.text,
            parentId: keyword.parent?.id,
            status: 'EDIT'
          })
        }
      }}
      ref={elementRef}
    />
  )
}

export default Block
