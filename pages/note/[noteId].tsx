import React from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"

import Note from "@/components/note"

const NoteDetail: NextPage = () => {

  const router = useRouter()
  const noteId = router.query.noteId as string

  return (
    <Note noteId={noteId}/>
  )
}

export default NoteDetail
