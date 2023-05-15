import {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType
} from "next"
import { useRouter } from "next/router"

import { getAuthTokenFromCookie } from "@/cookies/auth.cookie"

import Layout from "@/components/Layout"

const MyPage: NextPage = () => {
  return (
    <Layout sideScreenBody={(
      <></>
    )}>
      <></>
    </Layout>
  )
}

export default MyPage
