import React, { useState, useEffect, useRef, useCallback } from "react"

import clsx from "@/utils/clsx.util"

interface KeywordModel {
  id: number
  noteId: number
  posX: number
  posY: number
  text: string
  children: KeywordModel[]
  parent?: KeywordModel
}

interface KeywordData {
  noteId: number
  posX: number
  posY: number
  text: string
  parentId?: number
}

interface BlockProps {
  keyword?: KeywordModel
  config: {
    screenX?: number
    screenY?: number
  }
  onSubmit: () => void
}

const Block = ({ config, keyword, onSubmit }: BlockProps): JSX.Element => {
  const { screenX, screenY } = config

  const [posX, setPosX] = useState<number>(40)
  const [posY, setPosY] = useState<number>(120)

  useEffect(() => {
    if (keyword) {
      setPosX(keyword.posX)
      setPosY(keyword.posY)
    }
  }, [])

  return (
    <input type="text" className="absolute w-48 h-[30px] text-center focus:outline-knock-sub" style={{
      left: (screenX ?? 0) + posX,
      top: (screenY ?? 0) + posY
    }} />
  )
}

export default Block
