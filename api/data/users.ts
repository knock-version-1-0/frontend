export interface AuthTokenData {
  type: 'refresh'
  value: string
}

export interface AuthEmailData {
  email: string
  at: number
}
