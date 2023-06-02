import { useContext } from "react"
import { useRouter } from "next/router"
import Image from "next/image"

import { NoteAppContext } from "@/contexts/apps.context"
import { NoteData } from "@/api/data/notes"
import { StatusChoice } from "@/utils/enums.util"

import KnockLogo from '@/public/knock-logo-40.svg'
import clsx from "@/utils/clsx.util"
import AddIcon from '@mui/icons-material/Add'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

interface SideScreenProps extends React.PropsWithChildren {}

const SideScreen: React.FC<SideScreenProps> = (props) => {
  return (
    <div>
      <div className="relative w-[320px] h-full bg-white">
        <Header className="pl-4 pr-6 border-b"></Header>
        <div className="w-full h-full pt-20 pb-28">
          {props.children}
        </div>
        <Navigator className="px-8 border-t"></Navigator>
      </div>
    </div>
  )
}

const Header = (props: {
  className?: string
}): JSX.Element => {

  return (
    <div className={
      clsx(
        props.className ?? '',
        "absolute top-0 w-full flex flex-row justify-between items-center py-4"
      )
    }>
      <Image alt='logo' src={KnockLogo} />
      {/* <MenuIcon className="cursor-pointer hover:text-etc" /> */}
    </div>
  )
}

const Navigator = (props: {
  className?: string
}): JSX.Element => {
  const router = useRouter()
  const pathname = router.pathname

  const { items, addItem } = useContext(NoteAppContext)

  enum NavChoice {
    NOTE=1,
    ADD,
    MY
  }

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

  const handleClick = (choice: NavChoice) => {
    switch (choice) {
      case NavChoice.NOTE:
        if (!navPath.note.re.exec(pathname))
          window.location.replace(navPath.home.path)
        break
      case NavChoice.ADD:
        if (items.length !== 0 && items[0].name !== '') {
          const InitData: NoteData = {
            name: '',
            status: StatusChoice.SAVE
          }
          addItem(InitData)
        }
        break
      case NavChoice.MY:
        if (!navPath.my.re.exec(pathname))
          window.location.replace(navPath.my.path)
        break
    } 
  }

  return (
    <div className={
      clsx(
        props.className ?? '',
        "absolute bottom-0 w-full flex flex-row justify-between pt-3 pb-8"
      )}>
      <button onClick={()=>handleClick(NavChoice.NOTE)}>
        <DriveFileRenameOutlineIcon
          className={`${navPath.note.re.exec(pathname) ? '' : 'text-etc'}`}
        ></DriveFileRenameOutlineIcon>
      </button>
      <button onClick={()=>handleClick(NavChoice.ADD)}>
        <AddIcon
          className='hover:text-black text-etc'
        ></AddIcon>
      </button>
      <button onClick={()=>handleClick(NavChoice.MY)}>
        <AccountCircleIcon
          className={`${navPath.my.re.exec(pathname) ? '' : 'text-etc'} hover:text-black`}
        ></AccountCircleIcon>
      </button>
    </div>
  )
}

export default SideScreen
