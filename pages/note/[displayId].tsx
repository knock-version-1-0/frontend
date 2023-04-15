import React from "react"
import { 
  NextPage,
  GetStaticProps,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next"

import { getNoteByDisplayId, getNotes } from "@/api/notes.api"
import { NoteModel, NoteSummaryModel } from "@/models/notes.model"
import { NoteItemsContext } from "@/contexts"
import Note from "@/components/note"
import Layout from "@/components/Layout"

const NoteDetail: NextPage = ({ note, noteItems }: InferGetStaticPropsType<typeof getStaticProps>) => {

  return (
    <NoteItemsContext.Provider value={noteItems}>
      <Layout>
        <Note noteId={note.displayId}/>
      </Layout>
    </NoteItemsContext.Provider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNjgxNjQ2MjUzfQ.TPgMlBxtyuWsnoip9dQm1Rt5k0IsLwUNqWeSvxbfaMk'
  const response = await getNotes('', 0, token)
  const noteItems: NoteSummaryModel[] = response.data

  return {
    paths: noteItems.map((value) => {
      return {
        params: {displayId: value.displayId}
      }
    }),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNjgxNjQ2MjUzfQ.TPgMlBxtyuWsnoip9dQm1Rt5k0IsLwUNqWeSvxbfaMk'
  const note: NoteModel = (await getNoteByDisplayId(ctx.params!.displayId as string, token)).data
  const noteItems: NoteSummaryModel[] = (await getNotes('', 0, token)).data

  return {
    props: {
      note,
      noteItems
    }
  }
}

export default NoteDetail
