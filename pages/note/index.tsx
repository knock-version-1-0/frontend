import { useEffect } from "react"
import { 
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType
} from "next"
import { useRouter } from "next/router"

import Layout from "@/components/Layout"
import NoteSideScreenBody from "@/components/note/SideScreenBody"
import { getAuthTokenFromCookie } from "@/cookies/auth.cookie"
import { ApiGetNotes } from "@/api/notes.api"

const NoteHome: NextPage = ({ noteItems }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  useEffect(() => {
    if (noteItems.length !== 0)
      router.push(`/note/${noteItems[0].displayId}`)
  }, [])

  return (
    <Layout sideScreenBody={(
      <NoteSideScreenBody></NoteSideScreenBody>
    )}>
      <></>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const token = getAuthTokenFromCookie({req, res}) ?? ''

  const noteItems = await ApiGetNotes({
    name: '',
    offset: 0
  }, token)

  return {
    props: {
      noteItems
    }
  }
}

export default NoteHome
