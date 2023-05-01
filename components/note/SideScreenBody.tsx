import React, { useContext, useState } from "react"
import { useRouter } from "next/router"

import { NoteAppContext } from "@/contexts/apps.context"

import clsx from "@/utils/clsx.util"
import CancelIcon from '@mui/icons-material/Cancel'
import CircleIcon from '@mui/icons-material/Circle'
import Item from "./Item"

const NoteSideScreenBody = () => {
  const { items, isLast, next: showNextList } = useContext(NoteAppContext)

  const router = useRouter()
  const { displayId } = router.query

  const [showScrollbar, setShowScrollbar] = useState(false)

  const handleMouseEnter = () => {
    setShowScrollbar(true)
  }

  const handleMouseLeave = () => {
    setShowScrollbar(false)
  }

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
          "h-full pt-2 pl-2 pr-1"
        )}
      >
        {
          items.map((value, index) => (
            <Item value={value} displayId={displayId as string} key={index} />
          ))
        }
        <div className={`w-full py-3 text-center cursor-pointer hover:bg-zinc-50 hover:shadow-sm`}
          onClick={() => {
            if (!isLast)
              showNextList()
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
