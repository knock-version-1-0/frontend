"use client";

import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const noteListAppStore = useNoteList(noteItems);

  return (
    <NoteAppContext.Provider value={noteListAppStore}>
      <Layout sideScreenBody={(
        <div className="h-full flex flex-col justify-center items-center space-y-6 px-4">
          <p className="text-etc text-xl font-light">Do you want more?</p>
          <button className="mb-1 py-1 w-36 bg-knock-main rounded-md text-white text-sm hover:opacity-70" onClick={(e) => {
            e.stopPropagation();
            router.push('/login');
          }}>
            Go to login
          </button>
        </div>
      )}>
        <TutorialNote note={note}></TutorialNote>
      </Layout>
    </NoteAppContext.Provider>
  );
}

export default ClientPage;
