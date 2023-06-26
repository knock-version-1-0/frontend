"use client";

import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";

import { NoteEntity } from "@/models/notes.model";
import { NoteContext } from "@/contexts/components/note.context";
import { NoteStatusEnum, BlockStatusEnum } from "@/constants/notes.constant";
import { useNoteScreenPosition, useNoteStatus } from "@/hooks/components/note.hook";
import { KeywordEntity } from "@/models/notes.model";
import { KeywordData } from "@/api/data/notes";
import { useTutorialKeywordList } from "@/hooks/apps/notes.hook";

import Block from "./Block";
import Toolbar from "./Toolbar";
import Title from "./Title";
import { getCurrentTime } from "@/utils";

interface NoteProps {
  note: NoteEntity;
}

const TutorialNote: React.FC<NoteProps> = ({note}) => {
  const noteElementRef = useRef<HTMLDivElement>(null);

  const { screenX, screenY } = useNoteScreenPosition(noteElementRef);
  const { noteStatus, setNoteStatus } = useNoteStatus(NoteStatusEnum.EXIT);

  const { items: keywords, modifyItem, addItem, removeItem } = useTutorialKeywordList(note.keywords, note.id);

  const InitKeywordModel: KeywordEntity = {
    noteId: note.id,
    posX: 0,
    posY: 0,
    text: '',
    parentId: null,
    status: BlockStatusEnum.SELECT,
    timestamp: getCurrentTime()
  }
  const [PhantomKeywordModel, setPhantomKeywordModel] = useState<KeywordEntity>(InitKeywordModel);

  useEffect(() => {
    if (noteStatus === NoteStatusEnum.EXIT) {
      noteElementRef.current?.focus();
    }
    else if (noteStatus === NoteStatusEnum.KEYADD) {
      PhantomKeywordModel && setPhantomKeywordModel({
        ...PhantomKeywordModel,
        posX: 0,
        posY: 0
      });
    }
  }, [noteStatus]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (noteStatus === NoteStatusEnum.TITLEMOD) {
        if (e.nativeEvent.isComposing) return;
        setNoteStatus(NoteStatusEnum.EXIT);
      }
      else {
        setNoteStatus(NoteStatusEnum.EXIT);
      }
    }
    else if (e.key === "Enter") {
      if (noteStatus === NoteStatusEnum.EXIT) {
        setNoteStatus(NoteStatusEnum.KEYADD);
      }
      else if (noteStatus === NoteStatusEnum.TITLEMOD) {
        if (e.nativeEvent.isComposing) return;
        setNoteStatus(NoteStatusEnum.EXIT);
      }
    }
    else if (e.key === 'Tab') {
      e.preventDefault();
    }
  }, [noteStatus, setNoteStatus]);

  return (
    <NoteContext.Provider value={{
      noteStatus,
      setNoteStatus,
    }}>
      <div className="hidden sm:block w-full h-full focus:outline-none bg-zinc-50" ref={noteElementRef}
        onMouseMove={(e) => {
          if (noteStatus === NoteStatusEnum.KEYADD) {
            PhantomKeywordModel && setPhantomKeywordModel({
              ...PhantomKeywordModel,
              posX: e.clientX as number,
              posY: e.clientY as number
            });
          }
        }}
        onKeyDown={(e) => {handleKeyDown(e)}}
        tabIndex={0}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          setNoteStatus(NoteStatusEnum.EXIT);
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
            )) : (
              keywords.map((value, index) => (
                <Block
                  key={ index }
                  keyword={ value }
                  screenX={ screenX }
                  screenY={ screenY }
                  onUpdate={async (data: KeywordData) => await modifyItem(data, value.id as number)}
                  onDelete={async (key: number) => await removeItem(key)}
                  isPhantom={ false }
                ></Block>
              ))
            )
          }
          {
            noteStatus === NoteStatusEnum.KEYADD &&
            <Block
              keyword={ PhantomKeywordModel }
              screenX={ screenX }
              screenY={ screenY }
              onUpdate={async (data: KeywordData) => {}}
              onCreate={async (data: KeywordData) => await addItem(data)}
              isPhantom={ true }
            ></Block>
          }
          <Toolbar
            onCreateKeyword={() => setNoteStatus(NoteStatusEnum.KEYADD)}
          ></Toolbar>
        </div>
      </div>
    </NoteContext.Provider>
  );
}

export default TutorialNote;
