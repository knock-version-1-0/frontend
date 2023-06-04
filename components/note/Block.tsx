"use client";

import React, { useState, useEffect, useRef, useContext, useCallback } from "react"

import { NoteContext } from "@/contexts/note.context"
import { NoteStatusEnum, BlockStatusEnum } from "@/constants/note.constant"
import { KeywordEntity } from "@/models/notes.model"
import { KeywordData } from "@/api/data/notes"

import clsx from "@/utils/clsx.util"

interface BlockProps {
  keyword: KeywordEntity
  screenX: number
  screenY: number
  onUpdate: (data: KeywordData) => void
  onCreate?: (data: KeywordData) => void
}

const Block: React.FC<BlockProps> = ({ 
  screenX,
  screenY,
  keyword,
  onUpdate,
  onCreate
}) => {

  const { noteStatus, blockStatus, setBlockStatus } = useContext(NoteContext)

  const elementRef = useRef<HTMLInputElement>(null)

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
    if (noteStatus === NoteStatusEnum.EXIT) {
      setBlockStatus!(BlockStatusEnum.UNSELECT)
    }
    if (noteStatus === NoteStatusEnum.KEYADD) {
      setBlockStatus!(BlockStatusEnum.SELECT)
      elementRef.current && elementRef.current.focus()
    }
    else if (noteStatus === NoteStatusEnum.KEYMOD) {
      if (blockStatus === BlockStatusEnum.UNSELECT) {
        setBlockStatus!(BlockStatusEnum.SELECT)
      }
      else if (blockStatus === BlockStatusEnum.SELECT) {
        setBlockStatus!(BlockStatusEnum.EDIT)
      }
      else {
        setBlockStatus!(BlockStatusEnum.EDIT)
      }

      elementRef.current && elementRef.current.focus()
    }
  }, [noteStatus, blockStatus])

  return (
    <input type="text" className={clsx(
      "absolute w-48 h-[30px] text-center focus:outline-knock-sub border",
      noteStatus === NoteStatusEnum.KEYADD ? "cursor-auto" : ""
    )} style={noteStatus === NoteStatusEnum.KEYADD ? {
        left: center[0],
        top: center[1]
      } : {
        left: x,
        top: y
      }}
      onClick={(e) => {
        if (noteStatus === NoteStatusEnum.KEYADD) {
          e.preventDefault()
          onCreate && onCreate({
            noteId: keyword.noteId,
            posX: keyword.posX,
            posY: keyword.posY,
            text: keyword.text,
            parentId: keyword.parentId,
            status: BlockStatusEnum.EDIT,
            timestamp: Date.now()
          })
        }
      }}
      ref={elementRef}
      readOnly={blockStatus === BlockStatusEnum.SELECT}
    />
  )
}

export default Block
