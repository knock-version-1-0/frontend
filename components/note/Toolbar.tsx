import { useState, useEffect, useContext } from "react"

import { NoteContext } from "@/contexts/note.context"
import { NoteStatusEnum } from "@/constants/note.constant"

import ArrowCursorIcon from '@/components/svg/ArrowCursorIcon'
import KeywordInitialIcon from '@/components/svg/KeywordInitialIcon'
import CallMadeIcon from '@mui/icons-material/CallMade'
import RelationLineIcon from '@/components/svg/RelationLineIcon'
import FragmentLineIcon from '@/components/svg/FragmentLineIcon'
import clsx from "@/utils/clsx.util"

interface ToolbarProps {
  onCreateKeyword: () => void
}

enum Label {
  ArrowCursor = 1,
  KeywordInitial,
  Arrow,
  Line,
  FragmentLine
}

const Toolbar = ({ onCreateKeyword }: ToolbarProps): JSX.Element => {
  const { setNoteStatus } = useContext(NoteContext)

  const [cursor, setCursor] = useState<number>(0)
  
  return (
    <div className="absolute top-0 right-10 flex flex-col items-center justify-center space-y-4 w-[30px] h-full">
      <Button
        activeChildClassName="fill-knock-main"
        inActiveChildClassName="fill-black"
        icon={ArrowCursorIcon}
        setFocus={() => {
          setCursor(Label.ArrowCursor)
          setNoteStatus!(NoteStatusEnum.EXIT)
        }}
        label={Label.ArrowCursor}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="fill-knock-main"
        inActiveChildClassName="fill-black"
        icon={KeywordInitialIcon}
        setFocus={() => {
          setCursor(Label.KeywordInitial)
          setNoteStatus!(NoteStatusEnum.MOD)
        }}
        label={Label.KeywordInitial}
        cursor={cursor}
        onCreateKeyword={onCreateKeyword}
      ></Button>
      <Button
        activeChildClassName="text-knock-main"
        childClassName=""
        icon={CallMadeIcon}
        setFocus={() => {
          setCursor(Label.Arrow)
          setNoteStatus!(NoteStatusEnum.REL)
        }}
        label={Label.Arrow}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="stroke-knock-main"
        childClassName="stroke-2 stroke-black"
        icon={RelationLineIcon}
        setFocus={() => {
          setCursor(Label.Line)
          setNoteStatus!(NoteStatusEnum.REL)
        }}
        label={Label.Line}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="stroke-knock-main"
        childClassName="stroke-1 stroke-black"
        icon={FragmentLineIcon}
        setFocus={() => {
          setCursor(Label.FragmentLine)
          setNoteStatus!(NoteStatusEnum.REL)
        }}
        label={Label.FragmentLine}
        cursor={cursor}
      ></Button>
    </div>
  )
}

interface ButtonProps extends React.PropsWithChildren {
  activeChildClassName?: string
  inActiveChildClassName?: string
  childClassName?: string
  icon: any
  label: Label
  setFocus: () => void
  cursor: number
  onCreateKeyword?: () => void
}

const Button = (props: ButtonProps): JSX.Element => {
  const { noteStatus } = useContext(NoteContext)

  const { setFocus, cursor, label } = props

  const [hover, setHover] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(cursor === label || (cursor !== label && hover))
  }, [cursor, label, hover])

  useEffect(() => {
    if (noteStatus === NoteStatusEnum.EXIT && label === Label.ArrowCursor) {
      setFocus()
    }
    else if (noteStatus === NoteStatusEnum.MOD && label === Label.KeywordInitial) {
      setFocus()
    }
  }, [noteStatus, label])

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
        setFocus()
        if (label === Label.KeywordInitial) {
          props.onCreateKeyword!()
        }
      }}
    >
      <Icon
        statusClassName={isActive ? props.activeChildClassName : props.inActiveChildClassName}
        className={props.childClassName}
        icon={props.icon}
      ></Icon>
    </div>
  )
}

interface IconProps {
  statusClassName?: string
  className?: string
  icon: any
}

const Icon = (props: IconProps): JSX.Element => {
  const { statusClassName } = props

  return (
    <props.icon
      className={clsx(props.className, statusClassName)}
    ></props.icon>
  )
}

export default Toolbar
