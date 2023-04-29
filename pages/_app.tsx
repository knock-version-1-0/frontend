import '@/styles/globals.css'

import type { AppProps, AppContext as ReactAppContext } from 'next/app'
import Head from 'next/head'

import { AppContext } from "@/contexts/apps.context"
import { setAuthTokenFromCookie } from '@/cookies/auth.cookie'

export default function App({ Component, pageProps }: AppProps) {
  const {
    token
  } = pageProps

  return (
    <AppContext.Provider value={{
      token,
    }}>
      <Head>
        <title>KnocK</title>
      </Head>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}

App.getInitialProps = async ({ Component, ctx }: ReactAppContext) => {
  const { req, res } = ctx

  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  const token = process.env.NEXT_PUBLIC_TEST_TOKEN as string
  setAuthTokenFromCookie(token, {req, res})

  pageProps = {...pageProps, token}

  return { pageProps }
}
