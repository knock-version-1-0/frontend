// "use client";

// import { NoteAppContext } from "@/contexts/apps";
// import { NoteSummaryEntity } from "@/models/notes.model";
// import { useNoteList } from "@/hooks/apps/notes.hook";

// import Layout from "@/components/Layout";
// import NoteList from "@/components/note/NoteList";

// interface Props extends React.PropsWithChildren {
//   noteItems: NoteSummaryEntity[];
// }

// const ClientPage: React.FC<Props> = ({ noteItems }) => {
//   const noteListAppStore = useNoteList(noteItems);
//   return (
//     <NoteAppContext.Provider value={noteListAppStore}>
//       <Layout sideScreenBody={(
//         <NoteList />
//       )}>
//         <div className="w-full h-full bg-zinc-50"></div>
//       </Layout>
//     </NoteAppContext.Provider>
//   )
// }

// export default ClientPage;
