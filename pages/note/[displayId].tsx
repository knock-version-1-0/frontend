import React from "react"
import { 
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType
} from "next"

import { fetchGetNoteByDisplayIdApi, fetchGetNotesApi } from "@/api/notes.api"
import { fetchPostAuthTokenApi } from "@/api/users.api"
import { NoteEntity, NoteSummaryEntity } from "@/models/notes.model"
import { NoteAppContext } from "@/contexts/apps.context"
import { useNoteList } from "@/hooks/apps/notes.hook"
import { getAuthTokenFromCookie } from "@/cookies/auth.cookie"
import { ApiPayload } from "@/utils/types.util"
import { NoteDoesNotExist, OK } from "@/api/status"

import Note from "@/components/note"
import Layout from "@/components/Layout"
import NoteList from "@/components/note/NoteList"

const NoteDetailPage: NextPage = ({ note, noteItems }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const noteListAppStore = useNoteList(noteItems)

  return (
    <NoteAppContext.Provider value={noteListAppStore}>
      <Layout sideScreenBody={(
        <NoteList></NoteList>
      )}>
        <Note note={note}/>
      </Layout>
    </NoteAppContext.Provider>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const refreshToken = getAuthTokenFromCookie({req, res})
  if (!refreshToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }
  }
  const authPayload = await fetchPostAuthTokenApi({
    type: 'refresh',
    value: refreshToken
  })
  if (authPayload.status !== OK) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }
  }

  const token = authPayload.data!.value

  const noteItemsPayload: ApiPayload<NoteSummaryEntity[]> = await fetchGetNotesApi({
    name: '',
    offset: 0
  }, token)
  if (noteItemsPayload.status !== OK) { throw Error(noteItemsPayload.status) }
  const noteItems: NoteSummaryEntity[] = noteItemsPayload.data!

  const notePayload: ApiPayload<NoteEntity> = await fetchGetNoteByDisplayIdApi(params!.displayId as string, token)
  if (notePayload.status === NoteDoesNotExist) {
    res.statusCode = 404
    return {
      notFound: true
    }
  } else if (notePayload.status !== OK) {
    throw Error(notePayload.status)
  }
  const note: NoteEntity = notePayload.data!

  return {
    props: {
      note,
      noteItems
    }
  }
}

export default NoteDetailPage
