"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";

import { NoteEntity, NoteSummaryEntity } from "@/models/notes.model";
import { useNoteList, useKeywordList } from "@/hooks/apps/notes.hook";
import { NoteAppContext, KeywordAppContext } from "@/contexts/apps";

import Layout from "@/components/Layout";
import NoteList from "@/components/note/NoteList";
import Note from "@/components/note";

interface Props {
  note: NoteEntity;
  noteList: NoteSummaryEntity[];
  displayId: string;
}

const ClientPage = ({ note, noteList, displayId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const init = localStorage.getItem('init');
    if (!init && searchParams.get('init')) {
      localStorage.setItem('init', 'true');
      router.replace(pathname);
    }
    else if (init) {
      localStorage.removeItem('init');
      router.refresh();
    }
  });

  const noteListAppStore = useNoteList(noteList);
  const keywordListAppStore = useKeywordList(note.keywords, note.id);

  return (
    <NoteAppContext.Provider value={ noteListAppStore }>
      <Layout sideScreenBody={(
        <NoteList displayId={ displayId }></NoteList>
      )}>
        <KeywordAppContext.Provider value={ keywordListAppStore }>
          <Note note={ note }></Note>
        </KeywordAppContext.Provider>
      </Layout>
    </NoteAppContext.Provider>
  );
}

export default ClientPage;
