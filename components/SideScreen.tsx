"use client";

import { useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import { AppContext, NoteAppContext } from "@/contexts/apps";
import { NoteData } from "@/api/data/notes";
import { StatusChoice } from "@/utils/enums.util";

import KnockLogo from '@/public/knock-logo-40.svg';
import clsx from "@/utils/clsx.util";
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

interface SideScreenProps extends React.PropsWithChildren {}

const SideScreen: React.FC<SideScreenProps> = (props) => {
  return (
    <div>
      <div className="relative w-[360px] sm:w-[320px] h-full bg-white">
        <Header className="pl-4 pr-6 border-b"></Header>
        <div className="w-full h-full pt-20 pb-28">
          {props.children}
        </div>
        <Navigator className="px-8 border-t"></Navigator>
      </div>
    </div>
  );
}

const Header = (props: {
  className?: string;
}): JSX.Element => {

  return (
    <div className={
      clsx(
        props.className ?? '',
        "absolute top-0 w-full flex flex-row justify-between items-center py-4"
      )
    }>
      <Image alt='logo' src={KnockLogo} priority={true} />
      {/* <MenuIcon className="cursor-pointer hover:text-etc" /> */}
    </div>
  )
}

const Navigator = (props: {
  className?: string;
}): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();

  const { items, addItem } = useContext(NoteAppContext);
  const { user } = useContext(AppContext);

  const [profileHover, setProfileHover] = useState<boolean>(false);
  const [profileClicked, setProfileClicked] = useState<boolean>(false);

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
          window.location.replace(navPath.home.path);
        break
      case NavChoice.ADD:
        if (items.length !== 0 && items[0].name !== '') {
          const InitData: NoteData = {
            name: '',
            status: StatusChoice.SAVE
          }
          addItem(InitData);
        }
        break
      case NavChoice.MY:
        
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
      <div className="relative flex flex-col items-center"
        onMouseOut={() => setProfileHover(false)}
        onMouseOver={() => setProfileHover(true)}
      >
        <button
          onClick={()=>{
            handleClick(NavChoice.MY);
          }}
        >
          <AccountCircleIcon
            className='hover:text-black text-etc'
          ></AccountCircleIcon>
        </button>
        {
          profileHover && (
            <div className="absolute flex flex-row items-center space-x-1 bottom-6 px-2 bg-zinc-100 rounded-md hover:cursor-default">
              <div>
                <p className="text-xs">{ user?.username }</p>
              </div>
              <button className="mb-1" onClick={(e) => {
                e.stopPropagation();
                router.push('/note/modal');
              }}>
                <LogoutIcon className="text-sm hover:text-blue-500"></LogoutIcon>
              </button>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default SideScreen;
