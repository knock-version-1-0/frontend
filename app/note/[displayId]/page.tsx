import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';

import { fetchPostAuthTokenApi } from '@/api/users.api';
import { fetchGetNotesApi, fetchGetNoteByDisplayIdApi } from '@/api/notes.api';
import { NoteEntity, NoteSummaryEntity } from '@/models/notes.model';
import { OK, DatabaseError, NoteDoesNotExist } from '@/api/status';
import { ApiPayload } from '@/utils/types.util';
import { AUTH_TOKEN_KEY } from '@/constants/users.constant';

import ClientPage from './page.client';

const NoteSideScreenPage = async ({ params }: { params: { displayId: string } }) => {
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

  const payload = await fetchGetNotesApi({
    name: '',
    offset: 0
  }, token);
  if (payload.status === NoteDoesNotExist) { notFound(); }
  if (payload.status === DatabaseError) { throw Error(payload.status); }
  const noteList: NoteSummaryEntity[] = payload.data!;

  const notePayload: ApiPayload<NoteEntity> = await fetchGetNoteByDisplayIdApi(params.displayId as string, token);
  if (notePayload.status === NoteDoesNotExist) {
    notFound();
  } else if (notePayload.status !== OK) {
    throw Error(notePayload.status);
  }
  const note: NoteEntity = notePayload.data!;
  return <ClientPage noteList={ noteList } note={ note } displayId={ params.displayId } />;
}

export default NoteSideScreenPage;
