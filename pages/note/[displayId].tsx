import React from "react"
import { 
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType
} from "next"

import { ApiGetNoteByDisplayId, ApiGetNotes } from "@/api/notes.api"
import { NoteEntity, NoteSummaryEntity } from "@/models/notes.model"
import { NoteAppContext } from "@/contexts/apps.context"
import { useNoteList } from "@/hooks/apps.hook"
import { getAuthTokenFromCookie } from "@/cookies/auth.cookie"
import { ApiPayload } from "@/utils/types.util"
import { NoteDoesNotExist } from "@/utils/status.util"

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

  var payload: ApiPayload = await ApiGetNotes({
    name: '',
    offset: 0
  }, token)
  if (payload.status !== 'OK') { throw Error(payload.status) }
  const noteItems: NoteSummaryEntity[] = payload.data

  var payload: ApiPayload = await ApiGetNoteByDisplayId(params!.displayId as string, token)
  if (payload.status === NoteDoesNotExist) {
    res.statusCode = 404
    return {
      notFound: true
    }
  } else if (payload.status !== 'OK') {
    throw Error(payload.status)
  }
  const note: NoteEntity = payload.data

  return {
    props: {
      note,
      noteItems
    }
  }
}

export default NoteDetail
