import {
  NextPage,
} from "next"
import { useRouter } from "next/router"

import Layout from "@/components/Layout"
import EmailForm from "@/components/EmailForm"

const LoginPage: NextPage = () => {
  const router = useRouter()
  const sessionId = router.query['session-id']

  return (
    <>
      <Layout sideScreenBody={(
        sessionId ?
        <p>Success</p> :
        <EmailForm></EmailForm>
      )}>
        <></>
      </Layout>
    </>
  )
}

export default LoginPage
