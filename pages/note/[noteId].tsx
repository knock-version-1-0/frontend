import React, { useState, useEffect, useCallback, useRef } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { DEFAULT_COR_NUM, DEFAULT_ROW_NUM } from "@/constants/note.constant"

import Matrix, { nextIndex, prevIndex } from "@/utils/Matrix"

const Note: NextPage = () => {

  const router = useRouter()
  const noteId = router.query.noteId as string

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

interface KeywordProps {
  index: number
  cursor: number | null
  onSubmit: (index: number, text: string) => void
  setCursor: (idx: number|null) => void
}

const Keyword = (props: KeywordProps) => {
  const {index, cursor} = props;

  const cellSize = DEFAULT_COR_NUM * DEFAULT_ROW_NUM

  const [active, setActive] = useState<boolean>(index===cursor ? true : false)
  const [text, setText] = useState<string>('')
  const [isComposing, setIsComposing] = useState<boolean>(false)
  const [isEditable, setIsEditable] = useState<boolean>(false)

  const inputRef = useRef<null|HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current !== null) {
      if (index===cursor) {
        inputRef.current.focus()
      }
      else {inputRef.current.blur()}
    }
  }, [cursor])

  return (
    <input className={`w-32 h-8 px-1.5 bg-zinc-50 border border-gray-${text ? 500 : 300} text-center focus:border-blue cursor-${isEditable ? 'text' : 'default'}`}
      type="text" value={text}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (isComposing) return

        if (e.key === 'Enter') {
          if (isEditable) {
            props.onSubmit(index, text)
            props.setCursor(null)
          } else {setIsEditable(true)}
        }
        else if (!e.shiftKey && e.key === 'Tab') {
          e.preventDefault()

          props.onSubmit(index, text)
          const next = nextIndex(index, cellSize)
          props.setCursor(next)
        }
        else if (e.shiftKey && e.key === 'Tab') {
          e.preventDefault()

          props.onSubmit(index, text)
          const prev = prevIndex(index, cellSize)
          props.setCursor(prev)
        }
        else if (e.key === 'ArrowRight') {
          if (!isEditable) {
            e.preventDefault()
            props.setCursor(Matrix.right(index))
          }
        }
        else if (e.key === 'ArrowLeft') {
          if (!isEditable) {
            e.preventDefault()
            props.setCursor(Matrix.left(index))
          }
        }
        else if (e.key === 'ArrowUp') {
          if (!isEditable) {
            e.preventDefault()
            props.setCursor(Matrix.up(index))
          }
        }
        else if (e.key === 'ArrowDown') {
          if (!isEditable) {
            e.preventDefault()
            props.setCursor(Matrix.down(index))
          }
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        setText(text)
      }}
      ref={inputRef}
      onDoubleClick={(e) => {
        e.preventDefault()
        setIsEditable(true)
      }}
      onFocus={() => {props.setCursor(index)}}
      onBlur={() => {setIsEditable(false)}}
      readOnly={!isEditable}
    ></input>
  )
}

export default Note
