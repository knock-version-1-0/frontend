"use client";

import React, { useState, useEffect, useContext } from "react";

import { NoteContext } from "@/contexts/components/note.context";
import { NoteStatusEnum } from "@/constants/notes.constant";

import ArrowCursorIcon from '@/components/svg/ArrowCursorIcon';
import KeywordInitialIcon from '@/components/svg/KeywordInitialIcon';
import CallMadeIcon from '@mui/icons-material/CallMade';
import RelationLineIcon from '@/components/svg/RelationLineIcon';
import FragmentLineIcon from '@/components/svg/FragmentLineIcon';
import clsx from "@/utils/clsx.util";

interface ToolbarProps {
  onCreateKeyword: () => void;
}

enum Label {
  ArrowCursor = 1,
  KeywordInitial,
  Arrow,
  Line,
  FragmentLine
}

const Toolbar: React.FC<ToolbarProps> = ({ onCreateKeyword }) => {
  const { setNoteStatus } = useContext(NoteContext);

  const [cursor, setCursor] = useState<number>(0);
  
  return (
    <div className="absolute top-0 right-10 flex flex-col items-center justify-center space-y-4 w-[30px] h-full">
      <Button
        activeChildClassName="fill-knock-main"
        inActiveChildClassName="fill-black"
        icon={ArrowCursorIcon}
        setFocus={(status: NoteStatusEnum) => {
          setCursor(Label.ArrowCursor);
          setNoteStatus!(status);
        }}
        label={Label.ArrowCursor}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="fill-knock-main"
        inActiveChildClassName="fill-black"
        icon={KeywordInitialIcon}
        setFocus={(status: NoteStatusEnum) => {
          setCursor(Label.KeywordInitial);
          setNoteStatus!(status);
        }}
        label={Label.KeywordInitial}
        cursor={cursor}
        onCreateKeyword={onCreateKeyword}
      ></Button>
      <Button
        activeChildClassName="text-knock-main"
        childClassName=""
        icon={CallMadeIcon}
        setFocus={(status: NoteStatusEnum) => {
          setCursor(Label.Arrow);
          setNoteStatus!(status);
        }}
        label={Label.Arrow}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="stroke-knock-main"
        childClassName="stroke-2 stroke-black"
        icon={RelationLineIcon}
        setFocus={(status: NoteStatusEnum) => {
          setCursor(Label.Line);
          setNoteStatus!(status);
        }}
        label={Label.Line}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="stroke-knock-main"
        childClassName="stroke-1 stroke-black"
        icon={FragmentLineIcon}
        setFocus={(status: NoteStatusEnum) => {
          setCursor(Label.FragmentLine);
          setNoteStatus!(status);
        }}
        label={Label.FragmentLine}
        cursor={cursor}
      ></Button>
    </div>
  );
}

interface ButtonProps extends React.PropsWithChildren {
  activeChildClassName?: string
  inActiveChildClassName?: string
  childClassName?: string
  icon: any
  label: Label
  setFocus: (status: NoteStatusEnum) => void
  cursor: number
  onCreateKeyword?: () => void
}

const Button: React.FC<ButtonProps> = (props) => {
  const { noteStatus } = useContext(NoteContext);

  const { setFocus, cursor, label } = props;

  const [hover, setHover] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(cursor === label || (cursor !== label && hover))
  }, [cursor, label, hover]);

  useEffect(() => {
    if ((noteStatus === NoteStatusEnum.EXIT || noteStatus === NoteStatusEnum.TITLEMOD || noteStatus === NoteStatusEnum.KEYMOD) && label === Label.ArrowCursor) {
      setFocus(noteStatus);
    }
    else if ((noteStatus === NoteStatusEnum.KEYADD) && label === Label.KeywordInitial) {
      setFocus(noteStatus);
    }
  }, [noteStatus, label]);

  return (
    <div className={
      clsx(
        isActive ? "border border-knock-main" : "",
        "w-full h-[30px] flex items-center justify-center cursor-pointer"
      )
    }
      onMouseEnter={() => { setHover(true) }}
      onMouseLeave={() => { setHover(false) }}
      onClick={() => {
        if (label === Label.ArrowCursor) {
          setFocus(NoteStatusEnum.EXIT);
        }
        else if (label === Label.KeywordInitial) {
          setFocus(NoteStatusEnum.KEYADD);
          props.onCreateKeyword!();
        }
        else if (label === Label.Arrow) {
          setFocus(NoteStatusEnum.REL);
        }
        else if (label === Label.Line) {
          setFocus(NoteStatusEnum.REL);
        }
        else if (label === Label.FragmentLine) {
          setFocus(NoteStatusEnum.REL);
        }
      }}
    >
      <Icon
        statusClassName={isActive ? props.activeChildClassName : props.inActiveChildClassName}
        className={props.childClassName}
        icon={props.icon}
      ></Icon>
    </div>
  );
}

interface IconProps {
  statusClassName?: string;
  className?: string;
  icon: any;
}

const Icon: React.FC<IconProps> = (props) => {
  const { statusClassName } = props;

  return (
    <props.icon
      className={clsx(props.className, statusClassName)}
    ></props.icon>
  );
}

export default Toolbar;
