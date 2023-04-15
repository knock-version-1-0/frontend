import React from "react"
import { NextPage, GetStaticProps, InferGetStaticPropsType } from "next"
import { useRouter } from "next/router"

import { NoteSummaryModel } from "@/models/notes.model"
import { NoteItemsContext } from "@/contexts"

import { getNotes } from "@/api/notes.api"
import Layout from "@/components/Layout"

const NoteHome: NextPage = ({ noteItems }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [noteId, setNoteId] = React.useState('')
  const router = useRouter()

  const handleClick = () => {
    router.push(`/note/${noteId}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteId(e.target.value)
  }

  return (
    <NoteItemsContext.Provider value={noteItems}>
      <Layout>
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
    </NoteItemsContext.Provider>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNjgxNjQ2MjUzfQ.TPgMlBxtyuWsnoip9dQm1Rt5k0IsLwUNqWeSvxbfaMk'
  const response = await getNotes('', 0, token)
  const noteItems: NoteSummaryModel[] = response.data

  return {
    props: {
      noteItems
    }
  }
}

export default NoteHome
