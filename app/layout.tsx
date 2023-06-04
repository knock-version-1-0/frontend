import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { fetchPostAuthTokenApi } from '@/api/users.api';
import { OK } from '@/api/status';

import ClientLayout from './layout.client';

export const metadata: Metadata = {
  title: 'KnocK',
  description:
    'The cozy note, KnocK.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  let token;
  const refreshToken = cookieStore.get('auth/token')?.value;

  if (refreshToken) {
    const payload = await fetchPostAuthTokenApi({
      type: 'refresh',
      value: refreshToken
    });

    if (payload.status === OK) {
      token = payload.data!.value;
    }
  }

  return (
    <html lang="en">
      <body>
        <ClientLayout token={ token }>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
