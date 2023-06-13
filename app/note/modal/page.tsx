import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import ClientPage from './page.client';

const Page = async () => {
  return <ClientPage noteItems={ [] } />
}

export default Page;
