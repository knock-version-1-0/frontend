"use client";

import React, { useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { NoteAppContext } from "@/contexts/apps";
import { NoteSummaryEntity } from "@/models/notes.model";

import clsx from "@/utils/clsx.util";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

interface ItemProps {
  value: NoteSummaryEntity;
  displayId: string;
}

const Item: React.FC<ItemProps> = ({ value, displayId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { removeItem } = useContext(NoteAppContext);

  const [deleteSession, setDeleteSession] = useState<boolean>(false);
  const [removed, setRemoved] = useState<boolean>(false);

  return !removed ? (
    <li>
      <div
        onClick={() => {
          displayId !== value.displayId &&
            router.push(`/note/${value.displayId}`)
        }}
        className={
          clsx(
            displayId === value.displayId ? "outline outline-2 outline-knock-sub" : "hover:bg-zinc-50 hover:shadow-sm",
            "flex flex-row justify-between items-center cursor-pointer h-12 px-2 w-full border-b"
          )}
      >
        {
          !deleteSession ?
            <p className="text-lg font-light">{value.name}</p> :
            <div className="flex items-center bg-red-200 px-2 text-center rounded-sm hover:opacity-70"
              onClick={() => {
                removeItem(value.displayId);
                setDeleteSession(false);
                setRemoved(true);
              }}
            >
              <p className="text-red-500">Delete</p>
            </div>
        }
        {
          displayId === value.displayId && (!deleteSession ? (
            <DeleteIcon className="hover:text-etc"
              onClick={() => { setDeleteSession(true) }}
              style={{
                width: 20,
                height: 20
              }}
            ></DeleteIcon>
          ) : (
            <CloseIcon className="hover:text-etc"
              onClick={() => { setDeleteSession(false) }}
              style={{
                width: 20,
                height: 20
              }}
            ></CloseIcon>
          ))
        }
      </div>
    </li>
  ) : <></>;
}

export default Item;
