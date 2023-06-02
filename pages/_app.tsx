import '@/styles/globals.css'

import type { AppProps, AppContext as ReactAppContext } from 'next/app'
import Head from 'next/head'

import { AppContext } from "@/contexts/apps.context"
import { getAuthTokenFromCookie, setAuthTokenFromCookie } from '@/cookies/auth.cookie'
import { fetchPostAuthTokenApi } from '@/api/users.api'
import { OK } from '@/api/status'

export default function App({ Component, pageProps }: AppProps) {
  const {
    token
  } = pageProps

  return (
    <AppContext.Provider value={{
      token: token ?? undefined,
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

  let token = null
  const refreshToken = getAuthTokenFromCookie({req, res})
  if (refreshToken !== null) {
    const payload = await fetchPostAuthTokenApi({
      type: 'refresh',
      value: refreshToken
    })
    if (payload.status === OK) {
      token = payload.data!.value
    }
  }

  if (token === null) {
    if (res && req?.url !== '/login') {
			res.writeHead(302, { Location: '/login' })
			res.end()
		}
  }

  pageProps = {...pageProps, token}

  return { pageProps }
}
