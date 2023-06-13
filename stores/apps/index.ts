import { UserEntity } from '@/models/users.model';

export interface AppStore {
  token?: string;
  user?: UserEntity;
}

export const InitAppStore: AppStore = {
  token: undefined,
  user: undefined
}

export * from './notes';
