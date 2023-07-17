"use client";

import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { NoteEntity } from "@/models/notes.model";
import { NoteContext } from "@/contexts/components/note.context";
import { NoteStatusEnum, BlockStatusEnum } from "@/constants/notes.constant";
import { useNoteScreenPosition, useNoteStatus } from "@/hooks/components/note.hook";
import { KeywordEntity } from "@/models/notes.model";
import { KeywordData } from "@/api/data/notes";
import { KeywordAppContext } from "@/contexts/apps";

import Block from "./Block";
import Toolbar from "./Toolbar";
import Title from "./Title";
import { getCurrentTime } from "@/utils";

interface NoteProps {
  note: NoteEntity;
  keywordStore: KeywordListAppStore;
}

const Note: React.FC<NoteProps> = ({note}) => {
  const router = useRouter();
  const pathname = usePathname();

  const noteElementRef = useRef<HTMLDivElement>(null);

  const { screenX, screenY } = useNoteScreenPosition(noteElementRef);

  const { noteStatus, setNoteStatus, toNoteStatusOf, toBlockIdOf } = useNoteStatus(NoteStatusEnum.EXIT);
  useEffect(() => {
    if (noteStatus === NoteStatusEnum.EXIT) {
      noteElementRef.current?.focus();
    }
  }, [noteStatus]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      toNoteStatusOf(NoteStatusEnum.EXIT);
    }
    else if (e.key === "Enter") {
      if (noteStatus === NoteStatusEnum.EXIT) {
        toNoteStatusOf(NoteStatusEnum.KEYADD);
      }
    }
    else if (e.key === 'Tab') {
      e.preventDefault();
    }
  }, [noteStatus, toNoteStatusOf]);

  const { items: keywords, modifyItem, addItem, removeItem } = useContext(KeywordAppContext);

  const keywordEventWrapper = async (callback: () => Promise<void>) => {
    await callback();
    toNoteStatusOf(NoteStatusEnum.EXIT);
  }

  const InitKeywordModel: KeywordEntity = {
    noteId: note.id,
    posX: 0,
    posY: 0,
    text: '',
    parentId: null,
    status: BlockStatusEnum.SELECT,
    timestamp: getCurrentTime()
  }
  const [phantomKeywordModel, setPhantomKeywordModel] = useState<KeywordEntity>(InitKeywordModel);

  const blockElements: React.ReactNode = useMemo(() => keywords.map((value, index) => (
    <Block
      key={ index }
      keyword={ value }
      screenX={ screenX }
      screenY={ screenY }
      onUpdate={(data: KeywordData) => keywordEventWrapper(() => modifyItem(data, value.id as number))}
      onDelete={(key: number) => keywordEventWrapper(() => removeItem(key))}
      onClick={() => {toBlockIdOf(value.id!)}}
      isPhantom={ false }
    ></Block>
  )), [
    keywords,
    screenX,
    screenY,
    keywordEventWrapper,
    modifyItem,
    removeItem,
    toBlockIdOf
  ]);

  return (
    <NoteContext.Provider value={{
      noteStatus,
      setNoteStatus,
      toNoteStatusOf
    }}>
      <div className="hidden sm:block w-full h-full focus:outline-none bg-zinc-50" ref={noteElementRef}
        onMouseMove={(e) => {
          if (noteStatus === NoteStatusEnum.KEYADD) {
            setPhantomKeywordModel({
              ...phantomKeywordModel,
              posX: e.clientX as number,
              posY: e.clientY as number
            });
          }
        }}
        onKeyDown={(e) => {handleKeyDown(e)}}
        tabIndex={0}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          router.push(pathname);
        }}
      >
        <div className="hidden md:block mx-10">
          <Title note={note}></Title>
          {
            keywords.length === 0 ? (
              noteStatus !== NoteStatusEnum.KEYADD && (
              <div className="mt-56 mr-20 flex flex-col items-center text-3xl font-bold text-zinc-300 cursor-default">
                <p>Press [Enter] to create</p>
                <p>keyword</p>
              </div>
            )) : blockElements
          }
          {
            noteStatus === NoteStatusEnum.KEYADD &&
            <Block
              keyword={ phantomKeywordModel }
              screenX={ screenX }
              screenY={ screenY }
              onUpdate={async (data: KeywordData) => {}}
              onCreate={(data: KeywordData) => keywordEventWrapper(() => addItem(data))}
              isPhantom={ true }
            ></Block>
          }
          <Toolbar
            onCreateKeyword={() => toNoteStatusOf(NoteStatusEnum.KEYADD)}
          ></Toolbar>
        </div>
      </div>
    </NoteContext.Provider>
  );
}

export default Note;
