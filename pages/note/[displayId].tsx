import React from "react"
import { 
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType
} from "next"

import { ApiGetNoteByDisplayId, ApiGetNotes } from "@/api/notes.api"
import { NoteEntity } from "@/models/notes.model"
import { NoteAppContext } from "@/contexts/apps.context"
import { useNoteList } from "@/hooks/apps.hook"

import Note from "@/components/note"
import Layout from "@/components/Layout"
import NoteSideScreenBody from "@/components/note/SideScreenBody"
import { getAuthTokenFromCookie } from "@/cookies/auth.cookie"

const NoteDetail: NextPage = ({ note, noteItems }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const noteList = useNoteList(noteItems)

  return (
    <NoteAppContext.Provider value={noteList}>
      <Layout sideScreenBody={(
        <NoteSideScreenBody></NoteSideScreenBody>
      )}>
        <Note note={note}/>
      </Layout>
    </NoteAppContext.Provider>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const token = getAuthTokenFromCookie({req, res}) ?? ''

  const noteItems = await ApiGetNotes({
    name: '',
    offset: 0
  }, token)
  const note: NoteEntity = await ApiGetNoteByDisplayId(params!.displayId as string, token)

  return {
    props: {
      note,
      noteItems
    }
  }
}

export default NoteDetail
