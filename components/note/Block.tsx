"use client";

import React, { useState, useEffect, useRef, useCallback, useContext } from "react";

import { BlockStatusEnum, KEYWORD_LENGTH_LIMIT, NoteStatusEnum } from "@/constants/notes.constant";
import { KeywordEntity } from "@/models/notes.model";
import { KeywordData } from "@/api/data/notes";

import clsx from "@/utils/clsx.util";
import { getCurrentTime } from "@/utils";
import { NoteContext } from "@/contexts/components/note.context";
import { useBlockStatus } from "@/hooks/components/note.hook";

interface BlockProps {
  keyword: KeywordEntity;
  screenX: number;
  screenY: number;
  onUpdate: (data: KeywordData) => Promise<void>;
  onCreate?: (data: KeywordData) => Promise<void>;
  onDelete?: (key: number) => Promise<void>;
  isPhantom: boolean;
}

const Block: React.FC<BlockProps> = ({ 
  screenX,
  screenY,
  keyword,
  onUpdate,
  onCreate,
  onDelete,
  isPhantom,
}) => {
  const { noteStatus, setNoteStatus } = useContext(NoteContext);
  const { blockStatus, setBlockStatus } = useBlockStatus();

  const elementRef = useRef<HTMLInputElement>(null);
  isPhantom && elementRef.current?.focus();

  const [blockX, setBlockX] = useState<number>(0);
  const [blockY, setBlockY] = useState<number>(0);

  const [center, setCenter] = useState<Array<number>>([0, 0]);

  const [textValue, setTextValue] = useState<string>(keyword.text);

  useEffect(() => {
    if (keyword.status === BlockStatusEnum.EDIT) {
      setBlockStatus(BlockStatusEnum.EDIT);
      setNoteStatus!(NoteStatusEnum.KEYMOD);
    }
  }, [keyword]);

  useEffect(() => {
    if (noteStatus === NoteStatusEnum.KEYMOD) {
      elementRef.current?.focus();
    }
  }, [noteStatus]);

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

  const handleSubmit = useCallback(async (handleType: 'update' | 'create' | 'delete', status: BlockStatusEnum) => {
    switch(handleType)
    {
      case 'update':
        await onUpdate!({
          noteId: keyword.noteId,
          posX: keyword.posX,
          posY: keyword.posY,
          text: textValue,
          parentId: keyword.parentId,
          status: status,
          timestamp: getCurrentTime()
        });
        break;
      case 'create':
        await onCreate!({
          noteId: keyword.noteId,
          posX: center[0] - screenX,
          posY: center[1] - screenY,
          text: textValue,
          parentId: keyword.parentId,
          status: status,
          timestamp: getCurrentTime()
        });
        break;
      case 'delete':
        await onDelete!(keyword.id!);
      default:
        break;
    }
    setNoteStatus!(NoteStatusEnum.EXIT);
  }, [
    textValue,
    keyword,
    center,
    screenX,
    screenY,
    onUpdate,
    onCreate,
    onDelete,
    setNoteStatus
  ]);

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (isPhantom) {
      await handleSubmit('create', BlockStatusEnum.EDIT);
      return;
    }

    if (blockStatus === BlockStatusEnum.UNSELECT) {
      setBlockStatus(BlockStatusEnum.SELECT);
      return;
    }
    if (blockStatus === BlockStatusEnum.SELECT) {
      setBlockStatus(BlockStatusEnum.EDIT);
      return;
    }
  }, [isPhantom, blockStatus, handleSubmit, setBlockStatus]);

  const handleKeyDown = useCallback(async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (noteStatus === NoteStatusEnum.KEYMOD) {
        e.stopPropagation();

        if (e.nativeEvent.isComposing) return;
        elementRef.current?.blur();
        return;
      }
    }
    if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();

      if (isPhantom) {
        await handleSubmit('create', BlockStatusEnum.EDIT);
        return;
      }

      if (blockStatus === BlockStatusEnum.SELECT) {
        setBlockStatus(BlockStatusEnum.EDIT);
        return;
      }
      
      if (blockStatus === BlockStatusEnum.EDIT) {
        if (e.nativeEvent.isComposing) return;
        elementRef.current?.blur();
        return;
      }
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (blockStatus === BlockStatusEnum.SELECT) {
        e.stopPropagation();
        e.preventDefault();
        await handleSubmit('delete', BlockStatusEnum.UNSELECT);
        return;
      }
    }
  }, [isPhantom, blockStatus, noteStatus, handleSubmit]);

  const handleBlur = useCallback(async () => {
    if (blockStatus === BlockStatusEnum.EDIT) {
      await handleSubmit('update', BlockStatusEnum.UNSELECT);
    }
    setBlockStatus(BlockStatusEnum.UNSELECT);
  }, [blockStatus, handleSubmit]);

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
      onChange={(e) => {
        setTextValue(e.target.value);
      }}
      value={textValue}
      onClick={(e) => {
        e.preventDefault();
        handleClick(e);
      }}
      onFocus={() => {
        if (noteStatus !== NoteStatusEnum.KEYADD && noteStatus !== NoteStatusEnum.KEYMOD) {
          setNoteStatus!(NoteStatusEnum.KEYMOD);
        }
      }}
      onBlur={handleBlur}
      ref={elementRef}
      readOnly={blockStatus !== BlockStatusEnum.EDIT}
      maxLength={KEYWORD_LENGTH_LIMIT}
      onKeyDown={handleKeyDown}
    />
  );
}

export default Block;
