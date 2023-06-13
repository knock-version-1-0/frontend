"use client";

import '@/styles/globals.css';

import { AppContext } from '@/contexts/apps';

interface Props extends React.PropsWithChildren {
  token?: string;
}

export default function ClientLayout({
  children,
  token
}: Props) {

  return (
    <AppContext.Provider value={{
      token: token ?? undefined,
    }}>
      <div className="flex flex-row justify-center w-screen h-screen bg-zinc-50">
        {children}
      </div>
    </AppContext.Provider>
  );
}
