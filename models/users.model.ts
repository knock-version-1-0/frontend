export interface UserEntity {
  id: number;
  username: string;
  isActive: boolean;
  isStaff: boolean;
  email: string;
}

export interface AuthSessionEntity {
  id: string;
  emailCode: string;
  exp: number;
  at: number;
  email: string;
  attempt: number;
}

export interface AuthTokenEntity {
  type: 'refresh' | 'access';
  value: string;
}
