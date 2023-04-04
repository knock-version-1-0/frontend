import React, { useState, useEffect, useCallback } from "react"

import { DEFAULT_COR_NUM, DEFAULT_ROW_NUM } from "@/constants/note.constant"
import Keyword from "./Keyword"

const Note = ({noteId}: {noteId: string}): JSX.Element => {
  const [init, setInit] = useState<boolean>(true)
  const [enterCount, setEnterCount] = useState<number>(0)
  const [cursor, setCursor] = useState<number|null>(null)

  const [keywords, setKeywords] = useState<string[]>(
    [...Array(DEFAULT_COR_NUM * DEFAULT_ROW_NUM)].map(() => '')
  )

  useEffect(() => {
    if (init) {
      setCursor(0)
      setEnterCount(0)
      setInit(false)
    }
  }, [init])

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (document.activeElement?.tagName === 'BODY')
          plusCount()
      }
    }
    document.addEventListener('keydown', keyHandler)
    return () => {document.removeEventListener('keydown', keyHandler)}
  }, [enterCount])

  const plusCount = useCallback(() => {
    setEnterCount(enterCount + 1)
  }, [enterCount])

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.nodeName !== 'INPUT') {
        setCursor(null)
        setEnterCount(1)
      }
    }
    document.addEventListener('click', clickHandler)
    return () => {document.removeEventListener('click', clickHandler)}
  }, [cursor, enterCount])

  useEffect(() => {
    if (enterCount === 2) {
      setInit(true)
    }
  }, [enterCount])

  const handleSubmit = useCallback((index: number, text: string) => {
    if (index >= 0) {
      const cp = [...keywords]
      cp[index] = text
      setKeywords(cp)
    }
  }, [keywords])

  return (
    <div className="flex flex-col justify-center h-screen mb-24">
      <div className="mx-auto">
        <h1 className="text-xl font-bold text-lime-500 py-1">Note. {noteId}</h1>
        <div className={`grid grid-cols-4 grid-rows-8 my-4`}>
          {
            keywords.map((_, index: number) => (
              <Keyword
                key={index}
                index={index}
                onSubmit={handleSubmit}
                cursor={cursor}
                setCursor={(idx: number|null) => setCursor(idx)}
              ></Keyword>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Note
