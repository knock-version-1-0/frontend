import React from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"

const Note: NextPage = () => {
  const router = useRouter()
  const noteId = router.query.noteId as string

  const [text, setText] = React.useState<string>('')
  const [keywords, setKeywords] = React.useState<String[]>([])

  React.useEffect(() => {
    setText("")
  }, [keywords])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setKeywords([...keywords, text])
  }

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="mx-auto w-[400px]">
        <h1 className="text-xl font-bold text-lime-500 py-1">Note. {noteId}</h1>
        <div className="w-full h-[500px] bg-gray-50 my-4">
          {
            keywords.map((keyword, index) => (
              <Keyword
                inputValue={keyword}
                key={index}
              ></Keyword>
            ))
          }
        </div>
        <form className="flex flex-row w-full justify-between space-x-2" onSubmit={handleSubmit}>
          <input className="relative w-full border-2 border-gray-300" type="text" value={text} onChange={handleChange}/>
          <button className="px-2 py-1 bg-slate-300 rounded-md" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

const Keyword = (props: {inputValue: String}) => {
  return (
    <div className="py-2 bg-red-200">
      <span className="text-lg">{props.inputValue}</span>
    </div>
  )
}

export default Note;
