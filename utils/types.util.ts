export interface ApiPayload<T> {
  status: string;
  data?: T;
}

export type ErrorDetail = {
  type: string;
  message: string;
}

export type HookCallbackReturn<T> = {
  isSuccess: boolean;
  status: string;
  data?: T;
}

export interface ItemStore<Item, Data, KeyType> {
  items: Item[];
  loader?: {
    read?: boolean;
    add?: boolean;
    modify?: boolean;
    remove?: boolean;
  }
  addItem?: (data: Data) => Promise<HookCallbackReturn<Data>> | Promise<void>;
  modifyItem?: (data: Data, key: KeyType) => Promise<HookCallbackReturn<Item>> | Promise<void>;
  removeItem?: (key: KeyType) => Promise<HookCallbackReturn<Item>> | Promise<void>;
}
