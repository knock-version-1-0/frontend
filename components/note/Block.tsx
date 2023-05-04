import React, { useState, useEffect, useRef, useContext, useCallback } from "react"

import { NoteContext } from "@/contexts/note.context"
import { NoteStatusEnum, KeywordStatusEnum } from "@/constants/note.constant"

import { KeywordEntity } from "@/models/notes.model"
import { KeywordData } from "@/api/data/notes"

import clsx from "@/utils/clsx.util"

interface BlockProps {
  keyword: KeywordEntity
  config: {
    screenX: number
    screenY: number
    phantom: boolean
    setPhantom: (value: boolean) => void
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
  const [keywordStatus, setKeywordStatus] = useState<KeywordStatusEnum>(KeywordStatusEnum.UNSELECT)

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

    const height = elementRef.current?.offsetHeight ?? 0
    const width = elementRef.current?.offsetWidth ?? 0

    let centerX = keyword.posX - (width / 2)
    let centerY = keyword.posY - (height / 2)

    centerX = centerX < screenX ? screenX : centerX
    centerY = centerY < screenY ? screenY : centerY

    setCenter(
      [centerX, centerY]
    )
  }, [screenX, screenY, keyword])

  useEffect(() => {
    if (config.phantom) {
      elementRef.current && elementRef.current.focus()
    }
  }, [config.phantom])

  useEffect(() => {
    if (noteStatus === NoteStatusEnum.EXIT) {
      elementRef.current && elementRef.current.blur()
    }
  }, [noteStatus])

  const keywordEditStatusPolicy = useCallback(() => {
    setKeywordStatus(KeywordStatusEnum.EDIT)

    if (noteStatus !== NoteStatusEnum.MOD) {
      setNoteStatus!(NoteStatusEnum.MOD)
    }
  }, [noteStatus])

  const keywordReadStatusPolicy = useCallback(() => {
    setKeywordStatus(KeywordStatusEnum.READ)

    if (noteStatus !== NoteStatusEnum.MOD) {
      setNoteStatus!(NoteStatusEnum.MOD)
    }
  }, [noteStatus])

  const keywordUnselectStatusPolicy = useCallback(() => {
    setKeywordStatus(KeywordStatusEnum.UNSELECT)

    if (noteStatus !== NoteStatusEnum.EXIT) {
      setNoteStatus!(NoteStatusEnum.EXIT)
    }
    if (config.phantom) config.setPhantom(false)
  }, [noteStatus, config.phantom])

  return (
    <input type="text" className={clsx(
      "absolute w-48 h-[30px] text-center focus:outline-knock-sub border",
    )} style={config.phantom ? {
        left: center[0],
        top: center[1]
      } : {
        left: x,
        top: y
      }}
      onFocus={() => {
        if (config.phantom) {
          keywordReadStatusPolicy()
        } else {
          keywordEditStatusPolicy()
        }
      }}
      onBlur={() => {keywordUnselectStatusPolicy()}}
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
            status: KeywordStatusEnum.EDIT,
            timestamp: Date.now()
          })
        }
      }}
      ref={elementRef}
      readOnly={keywordStatus === KeywordStatusEnum.READ}
    />
  )
}

export default Block
