import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchPostAuthTokenApi } from '@/api/users.api';
import { fetchGetNotesApi, fetchPostNotesApi } from '@/api/notes.api';
import { NoteSummaryEntity } from '@/models/notes.model';
import { CREATED, OK } from '@/api/status';
import { AUTH_TOKEN_KEY } from '@/constants/users.constant';
import { StatusChoice } from '@/utils/enums.util';

const NotePage = async () => {
  const refreshToken = cookies().get(AUTH_TOKEN_KEY)?.value;
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

  const notesReadPayload = await fetchGetNotesApi({
    name: '',
    offset: 0
  }, token);
  if (notesReadPayload.status !== OK) { throw Error(notesReadPayload.status) }
  const noteItems: NoteSummaryEntity[] = notesReadPayload.data!

  if (noteItems.length !== 0) {
    redirect(`/note/${noteItems[0].displayId}`);
  }

  const NotesCreatePayload = await fetchPostNotesApi({
    name: '',
    status: StatusChoice.SAVE
  }, token);
  if (NotesCreatePayload.status !== CREATED) { throw Error(NotesCreatePayload.status) }
  redirect(`/note/${NotesCreatePayload.data!.displayId}`);
}

export default NotePage;
