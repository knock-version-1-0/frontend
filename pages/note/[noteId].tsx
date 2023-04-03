import { useState, useEffect, useCallback, useRef } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { DEFAULT_COR_NUM, DEFAULT_ROW_NUM } from "@/constants/note.constant"

import { nextIndex, prevIndex } from "@/utils/array"

const Note: NextPage = () => {

  const router = useRouter()
  const noteId = router.query.noteId as string

  const [cursor, setCursor] = useState<number|null>(null)

  const [keywords, setKeywords] = useState<string[]>(
    [...Array(DEFAULT_COR_NUM * DEFAULT_ROW_NUM)].map(() => '')
  )

  useEffect(() => {
    setCursor(0)
  }, [])

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
  index: number;
  cursor: number|null;
  onSubmit: (index: number, text: string) => void;
  setCursor: (idx: number|null) => void;
}

const Keyword = (props: KeywordProps) => {
  const {index, cursor} = props;

  const cellSize = DEFAULT_COR_NUM * DEFAULT_ROW_NUM

  const [text, setText] = useState<string>('')
  const [isComposing, setIsComposing] = useState(false)

  const inputRef = useRef<null|HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current !== null) {
      if (index===cursor) {inputRef.current.focus()}
      else {inputRef.current.blur()}
    }
  }, [cursor])

  return (
    <input className={`w-32 h-8 px-1.5 bg-zinc-50 border border-gray-${text ? 500 : 300} text-center`}
      type="text" value={text}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (isComposing) return

        if (e.key === 'Enter') {
          props.onSubmit(index, text)
          props.setCursor(null)
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
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        setText(text)
      }}
      ref={inputRef}
      onFocus={() => {props.setCursor(index)}}
    ></input>
  )
}

export default Note
