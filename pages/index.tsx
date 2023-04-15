import { NextPage } from "next"

import Note from "@/components/note"
import Layout from "@/components/Layout"

const Home: NextPage = () => {
  return (
    <Layout>
      <Note noteId="Tutorial"></Note>
    </Layout>
  )
}

export default Home
