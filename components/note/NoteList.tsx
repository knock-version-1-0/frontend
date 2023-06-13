"use client";

import React, { useCallback, useContext, useState, useRef } from "react";

import { NoteAppContext } from "@/contexts/apps";

import clsx from "@/utils/clsx.util";
import CancelIcon from '@mui/icons-material/Cancel';
import CircleIcon from '@mui/icons-material/Circle';
import Item from "./Item";

interface NoteListProps {
  displayId?: string;
}

const NoteList: React.FC<NoteListProps> = ({ displayId }) => {
  const { items, isLast, nextPage, loader } = useContext(NoteAppContext);

  const [showScrollbar, setShowScrollbar] = useState(false);

  const handleMouseEnter = () => {
    setShowScrollbar(true);
  }

  const handleMouseLeave = () => {
    setShowScrollbar(false);
  }

  return (
    <>
      <SearchBar/>
      {
        loader && !loader.read ? (
          <ul 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={clsx(
              "list",
              showScrollbar ? "scrollbar-visible" : "",
              "h-full pt-2 pl-3 pr-1"
            )}
          >
            {
              loader && loader.add && (
                <div>loading...</div>
              )
            }
            {
              items.map((value, index) => (
                <Item value={value} displayId={displayId as string} key={index} />
              )) 
            }
            {
              !isLast && (
                <div className={`w-full py-3 text-center cursor-pointer hover:bg-zinc-50 hover:shadow-sm`}
                  onClick={() => { nextPage() }}
                >  
                  <p className="text-sm text-knock-sub">Next</p>
                </div>
              )
            }
          </ul>
        ) : <div className="flex items-center justify-center h-full pt-2 pl-2 pr-1">loading...</div>
      }
    </>
  );
}

const SearchBar = (): JSX.Element => {
  const [name, setName] = useState<string>('');
  const { search } = useContext(NoteAppContext);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    search(value);
  }, [search]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      setName('')
      search('')
    }
  }

  return (
    <div className="flex flex-row">
      <input className="w-full border drop-shadow mx-2 px-2 py-1 focus:outline-none" value={name} type="text" onChange={handleSearchChange} ref={inputRef} />
      <div className="relative right-10 top-2 h-full cursor-pointer" onClick={handleClear}>
        <CancelIcon className="absolute top-0 left-0 w-4 h-4 text-etc z-20"></CancelIcon>
        <CircleIcon className="absolute top-0 left-0 w-4 h-4 z-10"></CircleIcon>
      </div>
    </div>
  );
}

export default NoteList;
