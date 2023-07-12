"use client";

import React, {
  useCallback,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";

import { NoteEntity } from "@/models/notes.model";
import { NoteAppContext } from "@/contexts/apps";
import { NoteStatusEnum } from "@/constants/notes.constant";
import { NoteNameDuplicate } from "@/api/status";
import { NOTE_NAME_LENGTH_LIMIT } from "@/constants/notes.constant";
import { NoteContext } from "@/contexts/components/note.context";

import Info from "../Info";
import ModeEditIcon from '@mui/icons-material/ModeEdit';

const Title = ({ note }: { note: NoteEntity }): JSX.Element => {
  const pathname = usePathname();

  const { modifyItem } = useContext(NoteAppContext);
  const { toNoteStatusOf } = useContext(NoteContext);

  const [noteName, setNoteName] = useState<string>(note.name);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  const [noteItem, setNoteItem] = useState<NoteEntity>(note);

  useEffect(() => {
    setIsDuplicate(false)
  }, [isDuplicate]);

  const titleElementRef = useRef<HTMLInputElement>(null);

  const submitNoteTitle = useCallback(async (name: string) => {
    const hookReturn = await modifyItem({
      name: name
    }, noteItem.displayId);

    if (hookReturn.isSuccess) {
      const data = hookReturn.data as NoteEntity;
      setNoteItem(data);
      setNoteName(data.name);
    } else if (hookReturn.status === NoteNameDuplicate) {
      setIsDuplicate(true);
    }

    titleElementRef.current?.blur();
    toNoteStatusOf!(NoteStatusEnum.EXIT);
  }, [noteItem, modifyItem, toNoteStatusOf]);

  const handleKeyDown = useCallback(async (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      if (e.nativeEvent.isComposing) return;
      await submitNoteTitle(noteName);
    }
    else if (e.key === "Enter") {
      e.stopPropagation();
      if (e.nativeEvent.isComposing) return;
      await submitNoteTitle(noteName);
    }
  }, [submitNoteTitle, noteName]);

  return (
    <>
      <nav className="mt-5 text-md">
        <span className="text-knock-sub underline cursor-pointer hover:opacity-70">{noteItem.name === '' ? '_' : noteItem.name}</span>
        <span className="mx-2">/</span>
      </nav>
      <div className="flex flex-row items-end mt-4">
        <div className="border-b border-black w-[284px] cursor-text">
          <input className="w-full text-2xl outline-none bg-transparent"
            ref={titleElementRef}
            value={noteName}
            onKeyDown={handleKeyDown}
            onClick={() => { toNoteStatusOf!(NoteStatusEnum.TITLEMOD) }}
            onChange={(e) => {
              setNoteName(e.target.value)
            }}
            maxLength={NOTE_NAME_LENGTH_LIMIT}
            readOnly={pathname === '/tutorial'}
          />
        </div>
        <ModeEditIcon></ModeEditIcon>
        <Info
          text={'! Note name is duplicated'}
          trigger={isDuplicate}
          className="ml-2"
        ></Info>
      </div>
    </>
  );
}

export default Title;
