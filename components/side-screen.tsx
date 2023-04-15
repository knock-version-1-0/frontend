import React, { useCallback, useContext, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"

import { AppContextApi } from "@/contexts";
import { ApiGetNotes } from "@/api/notes.api";
import { NoteSummaryModel } from "@/models/notes.model";
import KnockLogo from '@/public/knock-logo-40.svg';
import clsx from "@/utils/clsx.util";
import MenuIcon from '@mui/icons-material/Menu'
import CancelIcon from '@mui/icons-material/Cancel'
import CircleIcon from '@mui/icons-material/Circle'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import HomeIcon from '@mui/icons-material/Home'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { MAX_NOTE_LIST_SIZE } from "@/constants/note.constant";
import { setNoteOffsetFromCookie } from "@/cookies/note.cookie";

export const SideScreen = (): JSX.Element => {
  const { noteItems, token } = useContext(AppContextApi)
  const router = useRouter()
  const { displayId } = router.query

  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<NoteSummaryModel[]>(noteItems)
  const [isLast, setIsLast] = useState<boolean>(false)

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
    <div className="w-[400px] h-screen mx-4">
      <div className="relative h-full">
        <Header className="pr-2"></Header>
        <div className="w-full h-full pt-20 pb-28">
          <div className="flex flex-row">
            <input className="w-full border drop-shadow mx-2 px-2 py-1 focus:outline-none" type="text" />
            <div className="relative right-10 top-2 h-full">
              <CancelIcon className="absolute top-0 left-0 w-4 h-4 text-etc z-20"></CancelIcon>
              <CircleIcon className="absolute top-0 left-0 w-4 h-4 z-10"></CircleIcon>
            </div>
          </div>
          <div className="h-full overflow-auto pt-2 pl-2 pr-3">
            {
              items.map((value, index) => (
                <div key={value.displayId}>
                  <div
                    onClick={() => router.push(`/note/${value.displayId}`)}
                    className={
                      clsx(
                        displayId === value.displayId ?
                        "outline outline-2 outline-blue-500" : "",
                        "cursor-pointer py-3 px-2 w-full border-b",
                        "hover:bg-zinc-50 hover:shadow-sm"
                      )}
                  >
                    {value.name}
                  </div>
                </div> 
              ))
            }
            <div className={`w-full py-1 text-center cursor-pointer hover:bg-zinc-50 hover:shadow-sm`}
              onClick={() => {
                if (!isLast)
                  handleNextClick()
              }}
            >
              {
                !isLast && '다음'
              }
            </div>
          </div>
        </div>
        <Navigator></Navigator>
      </div>
    </div>
  )
}

const Header = (props: {
  className: string
}): JSX.Element => {

  return (
    <div className={
      clsx(
        props.className,
        "absolute top-0 w-full flex flex-row justify-between items-center py-4"
      )
    }>
      <Image alt='logo' src={KnockLogo} />
      <MenuIcon />
    </div>
  )
}

const Navigator = (): JSX.Element => {
  const router = useRouter()
  const pathname = router.pathname

  const navPath = {
    note: {
      re: new RegExp('^/note'),
      path: '/note'
    },
    home: {
      re: new RegExp('^/$'),
      path: '/'
    },
    my: {
      re: new RegExp('^/my'),
      path: '/my'
    }
  }

  const handleClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="absolute bottom-0 w-full flex flex-row justify-between px-4 pt-3 pb-8">
      <button onClick={()=>handleClick(navPath.note.path)}>
        <DriveFileRenameOutlineIcon
          className={`${navPath.note.re.exec(pathname) ? '' : 'text-etc'}`}
        ></DriveFileRenameOutlineIcon>
      </button>
      <button onClick={()=>handleClick(navPath.home.path)}>
        <HomeIcon
          className={`${navPath.home.re.exec(pathname) ? '' : 'text-etc'}`}
        ></HomeIcon>
      </button>
      <button onClick={()=>handleClick(navPath.my.path)}>
        <AccountCircleIcon
          className={`${navPath.my.re.exec(pathname) ? '' : 'text-etc'}`}
        ></AccountCircleIcon>
      </button>
    </div>
  )
}
