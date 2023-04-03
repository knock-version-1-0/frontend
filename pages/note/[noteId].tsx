import {useState, useEffect, useCallback, useRef} from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { COR_NUM, ROW_NUM } from "@/constants/note.constant"

const Note: NextPage = () => {

  const router = useRouter()
  const noteId = router.query.noteId as string

  const [cursor, setCursor] = useState<number|null>(null)

  const [keywords, setKeywords] = useState<string[]>(
    [...Array(COR_NUM * ROW_NUM)].map(() => '')
  )

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
}

const Keyword = (props: KeywordProps) => {
  const {index, cursor} = props;
  const [text, setText] = useState<string>('')
  const [focused, setFocused] = useState<Boolean>(index===cursor)

  const inputRef = useRef<null|HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      if (focused) {
        inputRef.current.focus();
      }
      else {
        inputRef.current.blur();
      }
    }
  })

  return (
    <input className={`w-32 h-8 px-1.5 bg-zinc-50 border border-gray-${text ? 500 : 300} text-center`}
      type="text" value={text}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter'){
          props.onSubmit(index, text)
          setFocused(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        setText(text)
      }}
      ref={inputRef}
      onClick={() => {setFocused(true)}}
    ></input>
  )
}

export default Note
