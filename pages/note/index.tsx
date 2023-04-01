import React from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"

const NoteHome: NextPage = () => {
  const [noteId, setNoteId] = React.useState('')
  const router = useRouter()

  const handleClick = () => {
    router.push(`/note/${noteId}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteId(e.target.value)
  }

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex flex-col items-center space-y-10 w-screen">
        <h1 className="text-2xl py-10">What note would you like to enter?</h1>
        <div className="flex flex-row space-x-3">
          <input type="text" className="w-96 border-2 border-gray-300"
            value={noteId} onChange={handleChange}
          />
          <button className="px-2 py-1 bg-slate-300 rounded-md"
            onClick={() => handleClick()}
          >Enter</button>
        </div>
      </div>
    </div>
  )
}

export default NoteHome
