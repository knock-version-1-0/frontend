import React, { useState, useEffect, useRef, useContext, useCallback } from "react"

import { NoteContext } from "@/contexts/note.context"
import { NoteStatusEnum, KeywordStatusEnum } from "@/constants/note.constant"
import { KeywordEntity } from "@/models/notes.model"
import { KeywordData } from "@/api/data/notes"
import { useKeywordStatus } from "@/hooks/note/note.hook"

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

  const { noteStatus, setNoteStatus } = useContext(NoteContext)
  const {
    keywordStatus,
    keywordEditStatusPolicy,
    keywordSelectStatusPolicy,
    keywordUnselectStatusPolicy
  } = useKeywordStatus({
    noteStatus: noteStatus,
    setNoteStatus: setNoteStatus!
  })

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
      elementRef.current && elementRef.current.blur()
    }
    else if (noteStatus === NoteStatusEnum.KEYADD) {
      elementRef.current && elementRef.current.focus()
    }
  }, [noteStatus])

  return (
    <input type="text" className={clsx(
      "absolute w-48 h-[30px] text-center focus:outline-knock-sub border",
    )} style={noteStatus === NoteStatusEnum.KEYADD ? {
        left: center[0],
        top: center[1]
      } : {
        left: x,
        top: y
      }}
      onFocus={() => {
        if (noteStatus === NoteStatusEnum.KEYADD) {
          keywordSelectStatusPolicy()
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
        if (noteStatus === NoteStatusEnum.KEYADD) {
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
      readOnly={keywordStatus === KeywordStatusEnum.SELECT}
    />
  )
}

export default Block
