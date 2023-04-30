export interface AppStore {
  token?: string
}

export const InitAppStore: AppStore = {
  token: undefined
}

export * from './notes'
