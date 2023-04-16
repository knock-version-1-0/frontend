import React from "react"
import { useRouter } from "next/router"
import Image from "next/image"

import KnockLogo from '@/public/knock-logo-40.svg';
import clsx from "@/utils/clsx.util";
import MenuIcon from '@mui/icons-material/Menu'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import HomeIcon from '@mui/icons-material/Home'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

interface SideScreenProps extends React.PropsWithChildren {}

export const SideScreen = (props: SideScreenProps): JSX.Element => {
  return (
    <div className="w-[400px] h-screen mx-4">
      <div className="relative h-full">
        <Header className="pr-2"></Header>
        <div className="w-full h-full pt-20 pb-28">
          {props.children}
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
