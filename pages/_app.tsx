import '@/styles/globals.css'

import type { AppProps, AppContext as ReactAppContext } from 'next/app'
import Head from 'next/head'

import { AppContext } from "@/contexts"
import { ApiGetNotes } from "@/api/notes.api"
import { setAuthTokenFromCookie } from '@/cookies/auth.cookie'
import { getNoteItemsFromCookie, setNoteItemsFromCookie } from '@/cookies/note.cookie'

export default function App({ Component, pageProps }: AppProps) {
  const {
    token,
    noteItems
  } = pageProps

  return (
    <AppContext.Provider value={{
      token,
      noteItems
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

  const noteItems = await ApiGetNotes({
    name: '',
    offset: 0
  }, token)
  setNoteItemsFromCookie(noteItems!, {req, res})

  pageProps = {...pageProps, token, noteItems}

  return { pageProps }
}
