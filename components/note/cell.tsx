import React, { useState, useEffect, useRef, useCallback } from "react"

import Matrix, { nextIndex, prevIndex } from "@/utils/matrix.util"
import clsx from "@/utils/clsx.util"

interface KeywordProps {
  index: number
  cursor: number | null
  onSubmit: (index: number, text: string) => void
  setCursor: (idx: number|null) => void
  matrix: Matrix<string>
}

const Keyword = (props: KeywordProps): JSX.Element => {
  const { index, cursor, matrix } = props

  const cellSize = matrix.cellSize

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

  const keyDownHandler = useCallback((e: React.KeyboardEvent) => {
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
        props.setCursor(matrix.rightIndex(index))
      }
    }
    else if (e.key === 'ArrowLeft') {
      if (!isEditable) {
        e.preventDefault()
        props.setCursor(matrix.leftIndex(index))
      }
    }
    else if (e.key === 'ArrowUp') {
      if (!isEditable) {
        e.preventDefault()
        props.setCursor(matrix.upIndex(index))
      }
    }
    else if (e.key === 'ArrowDown') {
      if (!isEditable) {
        e.preventDefault()
        props.setCursor(matrix.downIndex(index))
      }
    }
  }, [isComposing, isEditable])

  return (
    <input className={clsx(
      'w-32 h-8 px-1.5 bg-zinc-50',
      'border border-etc',
      `text-center cursor-${isEditable ? 'text' : 'default'}`
    )}
      type="text" value={text}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      onKeyDown={keyDownHandler}
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

export default Keyword
