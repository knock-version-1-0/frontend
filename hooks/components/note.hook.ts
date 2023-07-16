import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { NoteStatusEnum, BlockStatusEnum } from '@/constants/notes.constant';
import { KeywordEntity } from "@/models/notes.model";

export interface NoteState {
  noteStatus: NoteStatusEnum;
  setNoteStatus: React.Dispatch<React.SetStateAction<NoteStatusEnum>>;
  toNoteStatusOf: (noteStatus: NoteStatusEnum) => void;
  toBlockIdOf: (blockId: number) => void;
}

export const useNoteStatus = (init: NoteStatusEnum): NoteState => {
  const [noteStatus, setNoteStatus] = useState<NoteStatusEnum>(init);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ns = searchParams.get('ns');

  useEffect(() => {
    if (!ns) {
      setNoteStatus(NoteStatusEnum.EXIT);
    }
    else {
      setNoteStatus(Number(ns));
    }
  }, [ns, setNoteStatus]);

  const toNoteStatusOf = useCallback((noteStatus: NoteStatusEnum) => {
    setNoteStatus(noteStatus);
    
    if (noteStatus === NoteStatusEnum.EXIT) {
      router.push(pathname);
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set('ns', noteStatus.toString());
    router.push(pathname + '?' + params.toString());
  }, [router, pathname, setNoteStatus, searchParams]);

  const toBlockIdOf = useCallback((blockId: number) => {
    const params = new URLSearchParams(searchParams);

    params.set('ns', NoteStatusEnum.KEYMOD.toString());
    params.set('b', blockId.toString());

    router.push(pathname + '?' + params.toString());
  }, [router, pathname, searchParams]);
  
  return { noteStatus, setNoteStatus, toNoteStatusOf, toBlockIdOf }
}

interface NoteScreenPosition {
  screenX: number;
  screenY: number;
  // setScreenX: React.Dispatch<React.SetStateAction<number | undefined>>
  // setScreenY: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const useNoteScreenPosition = (ref: React.RefObject<HTMLDivElement>): NoteScreenPosition => {
  const [screenX, setScreenX] = useState<number>(0);
  const [screenY, setScreenY] = useState<number>(0);

  const getPosition = () => {
    const x = ref.current?.offsetLeft;
    const y = ref.current?.offsetTop;

    setScreenX((x??0) + 40); setScreenY((y??0) + 120);
  }
  
  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", getPosition);
  }, []);

  return { screenX, screenY }
}

export interface KeywordState {
  blockStatus: BlockStatusEnum;
  setBlockStatus: React.Dispatch<React.SetStateAction<BlockStatusEnum>>;
}

export const useBlockStatus = (keyword: KeywordEntity): KeywordState => {
  const [blockStatus, setBlockStatus] = useState<BlockStatusEnum>(BlockStatusEnum.UNSELECT);
  const searchParams = useSearchParams();

  const b = searchParams.get('b');

  useEffect(() => {
    if (!b) {
      setBlockStatus(BlockStatusEnum.UNSELECT);
      return;
    }

    if (!keyword.id) {
      setBlockStatus(BlockStatusEnum.EDIT);
      return;
    }

    if (Number(b) === keyword.id) {
      setBlockStatus(BlockStatusEnum.EDIT);
    } else {
      setBlockStatus(BlockStatusEnum.UNSELECT);
    }
  }, [keyword, b, setBlockStatus]);

  return {
    blockStatus,
    setBlockStatus,
  }
}
