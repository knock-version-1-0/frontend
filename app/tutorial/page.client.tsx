"use client";

import { useRouter } from "next/navigation";

import { NoteEntity, NoteSummaryEntity } from "@/models/notes.model";
import { useNoteList, useTutorialKeywordList } from "@/hooks/apps/notes.hook";
import { NoteAppContext, KeywordAppContext } from "@/contexts/apps";

import Layout from "@/components/Layout";
import Note from "@/components/note";

interface Props {
  note: NoteEntity;
  noteItems: NoteSummaryEntity[];
  displayId: string;
}

const ClientPage = ({ note, noteItems, displayId }: Props) => {
  const router = useRouter();

  const noteListAppStore = useNoteList(noteItems);
  const keywordListAppStore = useTutorialKeywordList(note.keywords, note.id);

  return (
    <NoteAppContext.Provider value={ noteListAppStore }>
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
        <KeywordAppContext.Provider value={ keywordListAppStore }>
          <Note note={note}></Note>
        </KeywordAppContext.Provider>
      </Layout>
    </NoteAppContext.Provider>
  );
}

export default ClientPage;
