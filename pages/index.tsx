import { useEffect } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"

import Layout from "@/components/Layout"

const HomePage: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/note')
  }, [])

  return (
    <Layout sideScreenBody={(
      <></>
    )}>
      <></>
    </Layout>
  )
}

export default HomePage
