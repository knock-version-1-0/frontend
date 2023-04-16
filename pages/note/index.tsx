import React from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"

import Layout from "@/components/Layout"
import NoteSideScreenBody from "@/components/note/SideScreenBody"

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
    <Layout sideScreenBody={(
      <NoteSideScreenBody></NoteSideScreenBody>
    )}>
      <div className="relative h-full flex flex-col justify-center items-center space-y-10 bg-zinc-50">
        <h1 className="text-2xl mb-10">What note would you like to enter?</h1>
        <div className="flex flex-row space-x-3">
          <input type="text" className="w-96 border-2 border-gray-300"
            value={noteId} onChange={handleChange}
          />
          <button className="px-2 py-1 bg-slate-300 rounded-md"
            onClick={() => handleClick()}
          >Enter</button>
        </div>
      </div>
    </Layout>
  )
}

export default NoteHome
