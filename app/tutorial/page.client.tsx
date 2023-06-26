"use client";

import { NoteEntity, NoteSummaryEntity } from "@/models/notes.model";
import { useNoteList } from "@/hooks/apps/notes.hook";
import { NoteAppContext } from "@/contexts/apps";

import Layout from "@/components/Layout";
import NoteList from "@/components/note/NoteList";
import TutorialNote from "@/components/note/TutorialNote";

interface Props {
  note: NoteEntity;
  noteItems: NoteSummaryEntity[];
  displayId: string;
}

const ClientPage = ({ note, noteItems, displayId }: Props) => {
  const noteListAppStore = useNoteList(noteItems);

  return (
    <NoteAppContext.Provider value={noteListAppStore}>
      <Layout sideScreenBody={(
        <NoteList displayId={displayId}></NoteList>
      )}>
        <TutorialNote note={note}></TutorialNote>
      </Layout>
    </NoteAppContext.Provider>
  );
}

export default ClientPage;
