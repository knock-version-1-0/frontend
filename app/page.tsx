import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AUTH_TOKEN_KEY } from '@/constants/users.constant';

const Page = ({ searchParams }: {
  searchParams?: {
    init?: string;
  }
}) => {
  const refreshToken = cookies().get(AUTH_TOKEN_KEY)?.value;
  if (!refreshToken) {
    redirect('/tutorial');
  }
  if (searchParams?.init) {
    redirect(`/note?init=${searchParams.init}`)
  }
  redirect('/note');
};

export default Page;
