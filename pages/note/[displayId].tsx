import React from "react"
import { 
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType
} from "next"

import { ApiGetNoteByDisplayId } from "@/api/notes.api"
import { NoteModel } from "@/models/notes.model"

import Note from "@/components/note"
import Layout from "@/components/Layout"
import NoteSideScreenBody from "@/components/note/SideScreenBody"
import { getAuthTokenFromCookie } from "@/cookies/auth.cookie"

const NoteDetail: NextPage = ({ note }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  return (
    <Layout sideScreenBody={(
      <NoteSideScreenBody></NoteSideScreenBody>
    )}>
      <Note note={note}/>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const token = getAuthTokenFromCookie({req, res}) ?? ''
  const note: NoteModel = await ApiGetNoteByDisplayId(params!.displayId as string, token)

  return {
    props: {
      note
    }
  }
}

export default NoteDetail
