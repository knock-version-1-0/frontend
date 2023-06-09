"use client";

import React, { useState, useEffect, useRef, useContext, useCallback } from "react";

import { NoteContext } from "@/contexts/note.context";
import { NoteStatusEnum, BlockStatusEnum, KEYWORD_LENGTH_LIMIT } from "@/constants/note.constant";
import { KeywordEntity } from "@/models/notes.model";
import { KeywordData } from "@/api/data/notes";

import clsx from "@/utils/clsx.util";
import { getCurrentTime } from "@/utils";

interface BlockProps {
  keyword: KeywordEntity;
  screenX: number;
  screenY: number;
  onUpdate: (data: KeywordData) => void;
  onCreate?: (data: KeywordData) => void;
  isPhantom: boolean;
}

const Block: React.FC<BlockProps> = ({ 
  screenX,
  screenY,
  keyword,
  onUpdate,
  onCreate,
  isPhantom
}) => {

  const { noteStatus, blockStatus, setBlockStatus, setNoteStatus } = useContext(NoteContext);

  const elementRef = useRef<HTMLInputElement>(null);

  const [blockX, setBlockX] = useState<number>(0);
  const [blockY, setBlockY] = useState<number>(0);

  const [center, setCenter] = useState<Array<number>>([0, 0]);

  useEffect(() => {
    if (keyword && screenX !== undefined && screenY !== undefined) {
      setBlockX(screenX + keyword.posX);
      setBlockY(screenY + keyword.posY);
    }

    const height = elementRef.current?.offsetHeight ?? 0;
    const width = elementRef.current?.offsetWidth ?? 0;

    const screenScope = {
      x: [screenX, window.document.documentElement.clientWidth-width-80],
      y: [screenY, window.document.documentElement.clientHeight-height-40]
    }

    let centerX = keyword.posX - (width / 2);
    let centerY = keyword.posY - (height / 2);
  
    if (centerX < screenScope.x[0]) {
      centerX = screenScope.x[0];
    } else if (centerX > screenScope.x[1]) {
      centerX = screenScope.x[1];
    }

    if (centerY < screenScope.y[0]) {
      centerY = screenScope.y[0];
    } else if (centerY > screenScope.y[1]) {
      centerY = screenScope.y[1];
    }

    setCenter(
      [centerX, centerY]
    );
  }, [screenX, screenY, keyword]);

  useEffect(() => {
    if (noteStatus === NoteStatusEnum.EXIT) {
      setBlockStatus!(BlockStatusEnum.UNSELECT);
    }
    else if (noteStatus === NoteStatusEnum.KEYADD) {
      setBlockStatus!(BlockStatusEnum.SELECT);
      elementRef.current && elementRef.current.focus();
    }
  }, [noteStatus, blockStatus]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    if (noteStatus === NoteStatusEnum.KEYADD) {
      e.preventDefault();
      onCreate!({
        noteId: keyword.noteId,
        posX: center[0] - screenX,
        posY: center[1] - screenY,
        text: keyword.text,
        parentId: keyword.parentId,
        status: BlockStatusEnum.EDIT,
        timestamp: getCurrentTime()
      });
    }
    else if (noteStatus === NoteStatusEnum.EXIT) {
      e.preventDefault();
      setNoteStatus!(NoteStatusEnum.KEYMOD);
      setBlockStatus!(BlockStatusEnum.SELECT);
    }
    else if (noteStatus === NoteStatusEnum.KEYMOD) {
      e.preventDefault();
      setBlockStatus!(BlockStatusEnum.EDIT);
    }
    elementRef.current && elementRef.current.focus();
  }, [noteStatus, center, keyword]);

  return (
    <input type="text" className={clsx(
      "absolute w-48 h-[30px] text-center focus:outline-knock-sub border border-knock-main",
      (blockStatus !== BlockStatusEnum.EDIT) ? "cursor-default" : "",
      (blockX === 0 && blockY === 0) ? "hidden" : ""
    )} style={isPhantom ? {
        left: center[0],
        top: center[1]
      } : {
        left: blockX,
        top: blockY
      }}
      onClick={(e) => {
        handleClick(e);
      }}
      onBlur={() => {
        if (noteStatus === NoteStatusEnum.KEYMOD) {
          setNoteStatus!(NoteStatusEnum.EXIT);
        }
      }}
      ref={elementRef}
      readOnly={blockStatus === BlockStatusEnum.SELECT}
      maxLength={KEYWORD_LENGTH_LIMIT}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          if (noteStatus === NoteStatusEnum.KEYADD) {
            onCreate!({
              noteId: keyword.noteId,
              posX: center[0] - screenX,
              posY: center[1] - screenY,
              text: keyword.text,
              parentId: keyword.parentId,
              status: BlockStatusEnum.EDIT,
              timestamp: getCurrentTime()
            });
          }
        }
      }}
    />
  );
}

export default Block;
