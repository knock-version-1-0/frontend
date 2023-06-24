import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AUTH_TOKEN_KEY } from '@/constants/users.constant';

const Page = () => {
  const refreshToken = cookies().get(AUTH_TOKEN_KEY)?.value;
  if (!refreshToken) {
    redirect('/tutorial');
  }
  redirect('/note');
};

export default Page;
