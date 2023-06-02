import { getCookie, setCookie, deleteCookie } from "cookies-next"

import { AUTH_TOKEN_KEY } from "@/constants/auth.constant"
import { ServerSideOpt } from "@/utils/cookie.util"

export const getAuthTokenFromCookie = ({ req, res }: ServerSideOpt): string | null => {
  const cookie = getCookie(AUTH_TOKEN_KEY, { req, res, httpOnly: true })
  if (cookie) return cookie as string
  else return null
}

export const setAuthTokenFromCookie = (token: string, { req, res }: ServerSideOpt): void => {
  setCookie(AUTH_TOKEN_KEY, token, { req, res, httpOnly: true })
}

export const removeAuthTokenFromCookie = ({ req, res }: ServerSideOpt): void => deleteCookie(AUTH_TOKEN_KEY)
