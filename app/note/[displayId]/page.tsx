import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';

import { fetchPostAuthTokenApi } from '@/api/users.api';
import { fetchGetNotesApi, fetchGetNoteByDisplayIdApi } from '@/api/notes.api';
import { NoteEntity, NoteSummaryEntity } from '@/models/notes.model';
import { OK, NoteDoesNotExist } from '@/api/status';
import { ApiPayload } from '@/utils/types.util';

import ClientPage from './page.client';

const NoteSideScreenPage = async ({ params }: { params: { displayId: string } }) => {
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
  }, token);
  if (payload.status !== OK) { throw Error(payload.status); }
  const noteItems: NoteSummaryEntity[] = payload.data!;

  const notePayload: ApiPayload<NoteEntity> = await fetchGetNoteByDisplayIdApi(params.displayId as string, token);
  if (notePayload.status === NoteDoesNotExist) {
    notFound();
  } else if (notePayload.status !== OK) {
    throw Error(notePayload.status);
  }
  const note: NoteEntity = notePayload.data!;

  return <ClientPage noteItems={ noteItems } note={ note } displayId={ params.displayId } />;
}

export default NoteSideScreenPage;
