import React, { useState, useEffect, useRef, useContext } from "react"

import { NoteContext } from "@/contexts/note.context"
import { NoteStatusChoice, KeywordStatusChoice } from "@/constants/note.constant"

import { KeywordEntity } from "@/models/notes.model"
import { KeywordData } from "@/api/data/notes"

import clsx from "@/utils/clsx.util"

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
  onCreate
}: BlockProps): JSX.Element => {

  const { noteStatus, setNoteStatus } = useContext(NoteContext)

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

  /**
   * Keyword가 phantom 상태일 때, 마우스 cursor의 가운데 지점을 중심으로 phantom Keyword를 움직일 수 있게 하기 위해 center값의 좌표를 계산.
   */
  useEffect(() => {
    const height = elementRef.current?.offsetHeight ?? 0
    const width = elementRef.current?.offsetWidth ?? 0
    keyword && setCenter(
      [keyword.posX - (width / 2), keyword.posY - (height / 2)]
    )
  }, [elementRef, keyword])

  return (
    <input type="text" className="absolute w-48 h-[30px] text-center focus:outline-knock-sub border" style={config.phantom ? {
        left: center[0],
        top: center[1]
      } : {
        left: x,
        top: y
      }}
      onFocus={() => {
        if (noteStatus !== NoteStatusChoice.MOD) {
          setNoteStatus!(NoteStatusChoice.MOD)
        }
      }}
      onBlur={() => {
        if (noteStatus !== NoteStatusChoice.EXIT) {
          setNoteStatus!(NoteStatusChoice.EXIT)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && elementRef.current) {
          elementRef.current.blur()
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
            parentId: keyword.parentId,
            status: KeywordStatusChoice.EDIT,
            timestamp: Date.now()
          })
        }
      }}
      ref={elementRef}
    />
  )
}

export default Block
