import React from "react"
import { 
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType
} from "next"

import { fetchGetNoteByDisplayIdApi, fetchGetNotesApi } from "@/api/notes.api"
import { NoteEntity, NoteSummaryEntity } from "@/models/notes.model"
import { NoteAppContext } from "@/contexts/apps.context"
import { useNoteList } from "@/hooks/apps.hook"
import { getAuthTokenFromCookie } from "@/cookies/auth.cookie"
import { ApiPayload } from "@/utils/types.util"
import { NoteDoesNotExist } from "@/api/status"

import Note from "@/components/note"
import Layout from "@/components/Layout"
import NoteSideScreenBody from "@/components/note/SideScreenBody"

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

  const noteItemsPayload: ApiPayload<NoteSummaryEntity[]> = await fetchGetNotesApi({
    name: '',
    offset: 0
  }, token)
  if (noteItemsPayload.status !== 'OK') { throw Error(noteItemsPayload.status) }
  const noteItems: NoteSummaryEntity[] = noteItemsPayload.data!

  var notePayload: ApiPayload<NoteEntity> = await fetchGetNoteByDisplayIdApi(params!.displayId as string, token)
  if (notePayload.status === NoteDoesNotExist) {
    res.statusCode = 404
    return {
      notFound: true
    }
  } else if (notePayload.status !== 'OK') {
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

export default NoteDetail
