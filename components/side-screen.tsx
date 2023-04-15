import React, { useContext } from "react"
import { useRouter } from "next/router"
import Image from "next/image"

import { NoteItemsContext } from "@/contexts";

import KnockLogo from '@/public/knock-logo-40.svg';
import clsx from "@/utils/clsx.util";
import MenuIcon from '@mui/icons-material/Menu'
import CancelIcon from '@mui/icons-material/Cancel'
import CircleIcon from '@mui/icons-material/Circle'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import HomeIcon from '@mui/icons-material/Home'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

export const SideScreen = (): JSX.Element => {
  const noteItems = useContext(NoteItemsContext)
  const router = useRouter()

  return (
    <div className="w-[375px] h-screen">
      <div className="relative h-full mx-4">
        <Header className="pr-2"></Header>
        <div className="w-full h-full py-20">
          <div className="flex flex-row">
            <input className="w-full border drop-shadow mx-2 px-2 py-1 focus:outline-none" type="text" />
            <div className="relative right-8 top-2 h-full">
              <CancelIcon className="absolute w-4 h-4 top-0 left-0 text-etc z-20"></CancelIcon>
              <CircleIcon className="absolute w-4 h-4 top-0 left-0 z-10"></CircleIcon>
            </div>
          </div>
          {
            noteItems?.map((value, index) => (
              <div key={index}
                onClick={() => router.push(`/note/${value.displayId}`)}
                className="cursor-pointer my-2 py-1 w-full border-b"
              >
                {value.name}
              </div>
            ))
          }
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
