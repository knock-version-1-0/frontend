import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchPostAuthTokenApi } from '@/api/users.api';
import { fetchGetNotesApi } from '@/api/notes.api';
import { NoteSummaryEntity } from '@/models/notes.model';
import { OK } from '@/api/status';

import ClientPage from './page.client';

const NotePage = async () => {
  const refreshToken = cookies().get('auth/token')?.value;
  if (!refreshToken) {
    redirect('/login');
  }

  const authPayload = await fetchPostAuthTokenApi({
    type: 'refresh',
    value: refreshToken
  });
  if (authPayload.status !== OK) {
    redirect('/login');
  }

  const token = authPayload.data!.value

  const payload = await fetchGetNotesApi({
    name: '',
    offset: 0
  }, token)
  if (payload.status !== OK) { throw Error(payload.status) }
  const noteItems: NoteSummaryEntity[] = payload.data!

  if (noteItems.length !== 0) {
    redirect(`/note/${noteItems[0].displayId}`);
  }
  
  return <ClientPage noteItems={ noteItems } />
}

export default NotePage;
