export interface ApiPayload<T> {
  status: string
  data?: T
}

export type ErrorDetail = {
  type: string
  message: string
}

export type HookCallbackReturn = {
  isSuccess: boolean
  status: string
}

export interface ItemStore<List, Data, KeyType> {
  items: List
  addItem?: (data: Data) => Promise<HookCallbackReturn> | void
  modifyItem?: (key: KeyType, data: Data) => Promise<HookCallbackReturn> | void
  removeItem?: (key: KeyType) => Promise<HookCallbackReturn> | void
}
