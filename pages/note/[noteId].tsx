import React from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { COR_NUM, ROW_NUM } from "@/constants/note.constant"

const Note: NextPage = () => {

  const router = useRouter()
  const noteId = router.query.noteId as string

  const [text, setText] = React.useState<string>('')
  const [keywords, setKeywords] = React.useState<string[]>(
    [...Array(COR_NUM * ROW_NUM)].map(() => '')
  )

  React.useEffect(() => {
    setText("")
  }, [keywords])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const index = keywords.findIndex(str => str === '')

    if (index >= 0) {
      const cp = [...keywords]
      cp[index] = text
      setKeywords(cp)
    }
  }

  const removekeyword = (index: number) => {
    const cp = [...keywords]
    cp[index] = ''
    setKeywords(cp)
  }

  return (
    <div className="flex flex-col justify-center h-screen mb-24">
      <div className="mx-auto">
        <h1 className="text-xl font-bold text-lime-500 py-1">Note. {noteId}</h1>
        <div className={`grid grid-cols-4 grid-rows-8 my-4`}>
          {
            keywords.map((keyword, index: number) => (
              <Keyword
                inputValue={keyword}
                key={index}
                onClick={() => { removekeyword(index) }}
              ></Keyword>
            ))
          }
        </div>
        <form className="flex flex-row w-full justify-between space-x-2" onSubmit={handleSubmit}>
          <input className="relative w-full border border-gray-500 rounded-sm outline-none px-1.5" type="text" value={text} onChange={handleChange}/>
          <button className="px-2 py-1 bg-slate-300 rounded-md" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

const Keyword = (props: {inputValue: string; onClick: () => void}) => {
  return (
    <div className={`w-32 h-8 px-1.5 bg-zinc-50 border border-gray-${props.inputValue ? 500 : 300} text-center cursor-pointer`}
      onClick={props.onClick}
    >
      <p className="truncate text-md">{props.inputValue}</p>
    </div>
  )
}

export default Note
