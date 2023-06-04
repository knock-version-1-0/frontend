import { useEffect } from "react"
import { 
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType
} from "next"
import { useRouter } from "next/router"

import { getAuthTokenFromCookie } from "@/cookies/auth.cookie"
import { fetchGetNotesApi } from "@/api/notes.api"
import { fetchPostAuthTokenApi } from "@/api/users.api"
import { NoteSummaryEntity } from "@/models/notes.model"
import { OK } from "@/api/status"
import { useNoteList } from "@/hooks/apps/notes.hook"
import { NoteAppContext } from "@/contexts/apps.context"

import Layout from "@/components/Layout"
import NoteList from "@/components/note/NoteList"

const NoteHomePage: NextPage = ({ noteItems }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const noteListAppStore = useNoteList(noteItems)
  const router = useRouter()

  useEffect(() => {
    if (noteItems.length !== 0)
      router.replace(`/note/${noteItems[0].displayId}`)
  }, [])

  return (
    <NoteAppContext.Provider value={noteListAppStore}>
      <Layout sideScreenBody={(
        <NoteList></NoteList>
      )}>
        <div className="w-full h-full bg-zinc-50"></div>
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

  const payload = await fetchGetNotesApi({
    name: '',
    offset: 0
  }, token)
  if (payload.status !== OK) { throw Error(payload.status) }
  const noteItems: NoteSummaryEntity[] = payload.data!

  return {
    props: {
      noteItems
    }
  }
}

export default NoteHomePage
