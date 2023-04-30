export interface ApiPayload<T> {
    status: string
    data?: T
}

export type ErrorDetail = {
    type: string
    message: string
}

export interface ItemStore<List, Data, KeyType> {
    items: List
    addItem: (data: Data) => void
    modifyItem: (data: Data) => void
    removeItem: (key: KeyType) => void
  }
