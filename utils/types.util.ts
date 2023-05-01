export interface ApiPayload<T> {
  status: string
  data?: T
}

export type ErrorDetail = {
  type: string
  message: string
}

export type CallbackReturn = {
  isSuccess: boolean
  status: string
}

export interface ItemStore<List, Data, KeyType> {
  items: List
  addItem?: (data: Data) => Promise<CallbackReturn>
  modifyItem?: (key: KeyType, data: Data) => Promise<CallbackReturn>
  removeItem?: (key: KeyType) => Promise<CallbackReturn>
}
