import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { fetchPostAuthTokenApi, fetchGetUserMeApi } from '@/api/users.api';
import { OK } from '@/api/status';
import { AUTH_TOKEN_KEY } from '@/constants/users.constant';

import ClientLayout from './layout.client';

export const metadata: Metadata = {
  title: 'KnocK',
  description:
    'The cozy note, KnocK.',
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let token; let user;

  let refreshToken = cookies().get(AUTH_TOKEN_KEY)?.value;

  if (refreshToken) {
    const payload = await fetchPostAuthTokenApi({
      type: 'refresh',
      value: refreshToken
    });

    if (payload.status === OK) {
      token = payload.data!.value;
    }
  }

  if (token) {
    const payload = await fetchGetUserMeApi(token);

    if (payload.status === OK) {
      user = payload.data!
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ClientLayout token={ token } user={ user }>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
