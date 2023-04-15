import React from "react"
import { NextPage, GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"

import { getNoteByName } from "@/api/notes.api"
import Note from "@/components/note"
import Layout from "@/components/Layout"

const NoteDetail: NextPage = () => {

  const router = useRouter()
  const displayId = router.query.displayId as string

  return (
    <Layout>
      <Note noteId={displayId}/>
    </Layout>
  )
}

export default NoteDetail
