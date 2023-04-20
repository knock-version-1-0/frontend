import React, { useState, useEffect, useCallback } from "react"

import { DEFAULT_COR_NUM, DEFAULT_ROW_NUM } from "@/constants/note.constant"
import Matrix from "@/utils/matrix.util"
import { NoteModel } from "@/models/notes.model"

import Keyword from "./Keyword"
import Toolbar from "./Toolbar"
import ModeEditIcon from '@mui/icons-material/ModeEdit'

const Note = ({note}: {note: NoteModel}): JSX.Element => {
  const matrix: Matrix<string> = new Matrix(DEFAULT_COR_NUM, DEFAULT_ROW_NUM)

  const [init, setInit] = useState<boolean>(true)
  const [enterCount, setEnterCount] = useState<number>(0)
  const [cursor, setCursor] = useState<number|null>(null)

  const [keywords, setKeywords] = useState<(string|null)[]>(matrix.table)

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
        if (document.activeElement?.tagName !== 'INPUT')
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
      } else {
        if (cursor !== null) {
          setEnterCount(0)
        }
      }
    }
    document.addEventListener('click', clickHandler)
    return () => {document.removeEventListener('click', clickHandler)}
  }, [cursor, enterCount])

  useEffect(() => {
    if (enterCount >= 2) {
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
    <div className="mx-10">
      <nav className="text-md mt-4 py-1 text-knock-sub underline cursor-pointer hover:opacity-70">{note.name}</nav>
      <div className="flex flex-row items-end mt-4">
        <div className="border-b border-black w-[240px] cursor-text">
          <h1 className="text-2xl">{note.name}</h1>
        </div>
        <ModeEditIcon></ModeEditIcon>
      </div>
      <div className="relative flex flex-row items-center">
        <div className="h-full flex flex-row justify-center items-center mt-10">
          <div className={`grid grid-cols-4 grid-rows-8 my-4`}>
            {
              keywords.map((_, index: number) => (
                <Keyword
                  key={index}
                  index={index}
                  onSubmit={handleSubmit}
                  cursor={cursor}
                  setCursor={(idx: number|null) => setCursor(idx)}
                  matrix={matrix}
                ></Keyword>
              ))
            }
          </div>
        </div>
        <Toolbar></Toolbar>
      </div>
    </div>
  )
}

export default Note
