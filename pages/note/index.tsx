import { useEffect } from "react"
import { 
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType
} from "next"
import { useRouter } from "next/router"

import { getAuthTokenFromCookie } from "@/cookies/auth.cookie"
import { fetchGetNotesApi } from "@/api/notes.api"
import { NoteSummaryEntity } from "@/models/notes.model"
import { OK } from "@/api/status"

import Layout from "@/components/Layout"
import NoteList from "@/components/note/NoteList"

const NoteHome: NextPage = ({ noteItems }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  useEffect(() => {
    if (noteItems.length !== 0)
      router.replace(`/note/${noteItems[0].displayId}`)
  }, [])

  return (
    <Layout sideScreenBody={(
      <NoteList></NoteList>
    )}>
      <></>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const token = getAuthTokenFromCookie({req, res}) ?? ''

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

export default NoteHome
