import { InitNoteEntity } from '@/models/notes.model';

import ClientPage from './page.client';

const TutorialPage = () => {
  return (
    <ClientPage
      note={InitNoteEntity}
      noteItems={[InitNoteEntity]}
      displayId={InitNoteEntity.displayId}
    ></ClientPage>
  )
}

export default TutorialPage;
