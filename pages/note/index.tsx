import { useEffect, useContext } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"

import Layout from "@/components/Layout"
import NoteSideScreenBody from "@/components/note/SideScreenBody"
import { AppContext } from "@/contexts"

const NoteHome: NextPage = () => {
  const router = useRouter()

  const { noteItems } = useContext(AppContext)

  useEffect(() => {
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

export default NoteHome
