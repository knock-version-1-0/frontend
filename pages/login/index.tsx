import {
  NextPage,
} from "next"
import { useRouter } from "next/router"

import Layout from "@/components/Layout"
import EmailForm from "@/components/login/EmailForm"
import AuthForm from "@/components/login/AuthForm"

const LoginPage: NextPage = () => {
  const router = useRouter()
  const sessionId = router.query['session-id'] as string
  const email = router.query['email'] as string

  return (
    <>
      <Layout sideScreenBody={(
        sessionId ?
        <AuthForm sessionId={sessionId} email={email} /> :
        <EmailForm />
      )}>
        <></>
      </Layout>
    </>
  )
}

export default LoginPage
