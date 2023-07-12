"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";

import { NoteEntity, NoteSummaryEntity } from "@/models/notes.model";
import { useNoteList, useKeywordList } from "@/hooks/apps/notes.hook";
import { NoteAppContext } from "@/contexts/apps";

import Layout from "@/components/Layout";
import NoteList from "@/components/note/NoteList";
import Note from "@/components/note";

interface Props {
  note: NoteEntity;
  noteItems: NoteSummaryEntity[];
  displayId: string;
}

const ClientPage = ({ note, noteItems, displayId }: Props) => {
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

  const noteListAppStore = useNoteList(noteItems);
  const keywordListAppStore = useKeywordList(note.keywords, note.id);

  return (
    <NoteAppContext.Provider value={ noteListAppStore }>
      <Layout sideScreenBody={(
        <NoteList displayId={ displayId }></NoteList>
      )}>
        <Note note={ note } keywordStore={keywordListAppStore}></Note>
      </Layout>
    </NoteAppContext.Provider>
  );
}

export default ClientPage;
