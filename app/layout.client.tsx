"use client";

import '@/styles/globals.css';

import { AppContext } from '@/contexts/apps';
import { UserEntity } from '@/models/users.model';

interface Props extends React.PropsWithChildren {
  token?: string;
  user?: UserEntity;
}

export default function ClientLayout({
  children,
  token,
  user
}: Props) {

  return (
    <AppContext.Provider value={{
      token: token,
      user: user
    }}>
      <div className="flex flex-row justify-center w-screen h-screen bg-zinc-50">
        {children}
      </div>
    </AppContext.Provider>
  );
}
