"use client";

import { NoteSummaryEntity } from "@/models/notes.model";

import Layout from "@/components/Layout";
import NoteList from "@/components/note/NoteList";

interface Props extends React.PropsWithChildren {
  noteItems: NoteSummaryEntity[];
}

const ClientPage: React.FC<Props> = ({ noteItems }) => {
  return (
    <Layout sideScreenBody={(
      <></>
    )}>
      <div className="w-full h-full bg-zinc-50"></div>
    </Layout>
  )
}

export default ClientPage;
