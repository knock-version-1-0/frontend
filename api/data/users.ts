export interface AuthTokenData {
  type: 'refresh'
  value: string
}

export interface AuthEmailData {
  email: string
  at: number
}

export interface AuthVerificationData {
  id: string
  email: string
  emailCode: string
  currentTime: number
}

export interface UserData {
  email: string
}
