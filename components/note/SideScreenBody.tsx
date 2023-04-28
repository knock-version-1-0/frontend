import React, { useCallback, useContext, useState } from "react"
import { useRouter } from "next/router"

import { AppContext } from "@/contexts"
import { ApiGetNotes } from "@/api/notes.api"
import { NoteSummaryEntity } from "@/models/notes.model"
import clsx from "@/utils/clsx.util"
import CancelIcon from '@mui/icons-material/Cancel'
import CircleIcon from '@mui/icons-material/Circle'
import { MAX_NOTE_LIST_SIZE } from "@/constants/note.constant"
import { setNoteOffsetFromCookie } from "@/cookies/note.cookie"

const NoteSideScreenBody = () => {
  const { noteItems, token } = useContext(AppContext)
  const router = useRouter()
  const { displayId } = router.query

  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<NoteSummaryEntity[]>(noteItems)
  const [isLast, setIsLast] = useState<boolean>(false)
  const [showScrollbar, setShowScrollbar] = useState(false);

  const handleMouseEnter = () => {
    setShowScrollbar(true);
  };

  const handleMouseLeave = () => {
    setShowScrollbar(false);
  }

  const handleNextClick = useCallback(async () => {
    const nextOffset = offset + MAX_NOTE_LIST_SIZE
    setOffset(nextOffset)
    setNoteOffsetFromCookie(nextOffset)

    const data = await ApiGetNotes({
      offset: nextOffset
    }, token ?? '')
    if (data) {
      if (data.length === 0) {
        setIsLast(true)
      }
      else if (data.length >= 0 && data.length < MAX_NOTE_LIST_SIZE) {
        setItems([...items, ...data])
        setIsLast(true)
      } else {
        setItems([...items, ...data])
      }
    }
  }, [offset, items])

  return (
    <>
      <div className="flex flex-row">
        <input className="w-full border drop-shadow mx-2 px-2 py-1 focus:outline-none" type="text" />
        <div className="relative right-10 top-2 h-full">
          <CancelIcon className="absolute top-0 left-0 w-4 h-4 text-etc z-20"></CancelIcon>
          <CircleIcon className="absolute top-0 left-0 w-4 h-4 z-10"></CircleIcon>
        </div>
      </div>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={clsx(
          "list",
          showScrollbar ? "scrollbar-visible" : "",
          "h-full pt-2 pl-2 pr-3"
        )}
      >
        {
          items.map((value, index) => (
            <div key={value.displayId}>
              <div
                onClick={() => router.push(`/note/${value.displayId}`)}
                className={
                  clsx(
                    displayId === value.displayId ? "outline outline-2 outline-knock-sub" : "",
                    "cursor-pointer py-3 px-2 w-full border-b",
                    "hover:bg-zinc-50 hover:shadow-sm"
                  )}
              >
                {value.name}
              </div>
            </div>
          ))
        }
        <div className={`w-full py-3 text-center cursor-pointer hover:bg-zinc-50 hover:shadow-sm`}
          onClick={() => {
            if (!isLast)
              handleNextClick()
          }}
        >
          {
            !isLast && <p className="text-sm text-knock-sub">Next</p>
          }
        </div>
      </div>
    </>
  )
}

export default NoteSideScreenBody
