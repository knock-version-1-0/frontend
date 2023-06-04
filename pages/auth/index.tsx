import {
  NextPage,
  GetServerSideProps,
} from "next"

import { setAuthTokenFromCookie } from "@/cookies/auth.cookie"

const AuthPage: NextPage = () => {
  return (
    <></>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
  const token = query.token as string
  setAuthTokenFromCookie(token, { req, res })

  return {
    redirect: {
      permanent: false,
      destination: "/note"
    }
  }
}

export default AuthPage
