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
  onClick?: () => void;
  isPhantom: boolean;
}

const Block: React.FC<BlockProps> = ({ 
  screenX,
  screenY,
  keyword,
  onUpdate,
  onCreate,
  onDelete,
  onClick,
  isPhantom,
}) => {
  const { noteStatus, toNoteStatusOf } = useContext(NoteContext);
  const { blockStatus } = useBlockStatus(keyword);

  const elementRef = useRef<HTMLInputElement>(null);
  isPhantom && elementRef.current?.focus();

  const [blockX, setBlockX] = useState<number>(0);
  const [blockY, setBlockY] = useState<number>(0);

  const [center, setCenter] = useState<Array<number>>([0, 0]);

  const [textValue, setTextValue] = useState<string>(keyword.text);

  const [clickCount, setClickCount] = useState<number>(0);

  useEffect(() => {
    if (blockStatus === BlockStatusEnum.EDIT) {
      elementRef.current?.focus();
    }
    else if (blockStatus === BlockStatusEnum.UNSELECT) {
      setClickCount(0);
      elementRef.current?.blur();
    }
  }, [blockStatus, setClickCount]);

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

  const handleSubmit = useCallback(async (handleType: 'update' | 'create' | 'delete', status: BlockStatusEnum, init?: Boolean) => {
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

    if (!init){
      toNoteStatusOf!(NoteStatusEnum.EXIT);
    }
  }, [
    textValue,
    keyword,
    center,
    screenX,
    screenY,
    onUpdate,
    onCreate,
    onDelete,
    toNoteStatusOf,
  ]);

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (isPhantom) {
      await handleSubmit('create', BlockStatusEnum.UNSELECT);
      return;
    }

    if (clickCount === 1) {
      setClickCount(2);
      return;
    }
  }, [isPhantom, clickCount, setClickCount, handleSubmit]);

  const handleKeyDown = useCallback(async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (noteStatus === NoteStatusEnum.KEYMOD) {
        e.stopPropagation();

        if (e.nativeEvent.isComposing) return;
        await handleSubmit('update', BlockStatusEnum.UNSELECT);
        return;
      }
    }
    else if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();

      if (isPhantom) {
        await handleSubmit('create', BlockStatusEnum.UNSELECT);
        return;
      }

      if (clickCount === 1) {
        setClickCount(2);
        return;
      }
      
      if (clickCount === 2) {
        if (e.nativeEvent.isComposing) return;
        await handleSubmit('update', BlockStatusEnum.UNSELECT);
        setClickCount(0);
        return;
      }
    }
    else if (e.key === 'Backspace' || e.key === 'Delete') {
      if (clickCount === 1) {
        e.stopPropagation();
        e.preventDefault();
        await handleSubmit('delete', BlockStatusEnum.UNSELECT);
        return;
      }
    }
  }, [isPhantom, clickCount, setClickCount, noteStatus, handleSubmit]);

  return (
    <input type="text" className={clsx(
      "absolute w-48 h-[30px] text-center focus:outline-knock-sub border border-knock-main",
      (clickCount < 2) ? "cursor-default" : "",
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
        if (clickCount === 0) {
          onClick && onClick();
          setClickCount(1);
        }
        handleClick(e);
      }}
      ref={elementRef}
      readOnly={clickCount < 2}
      maxLength={KEYWORD_LENGTH_LIMIT}
      onKeyDown={handleKeyDown}
    />
  );
}

export default Block;
