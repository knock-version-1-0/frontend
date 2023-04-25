import { useState, useEffect } from "react"

import ArrowCursorIcon from '@/components/svg/ArrowCursorIcon'
import KeywordInitialIcon from '@/components/svg/KeywordInitialIcon'
import CallMadeIcon from '@mui/icons-material/CallMade'
import RelationLineIcon from '@/components/svg/RelationLineIcon'
import FragmentLineIcon from '@/components/svg/FragmentLineIcon'
import clsx from "@/utils/clsx.util"

const Toolbar = (): JSX.Element => {
  const [cursor, setCursor] = useState<number>(0)
  
  return (
    <div className="absolute top-0 right-10 flex flex-col items-center justify-center space-y-4 w-[30px] h-full">
      <Button
        activeChildClassName="fill-knock-main"
        inActiveChildClassName="fill-black"
        icon={ArrowCursorIcon}
        onClick={() => setCursor(1)}
        label={1}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="fill-knock-main"
        inActiveChildClassName="fill-black"
        icon={KeywordInitialIcon}
        onClick={() => setCursor(2)}
        label={2}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="text-knock-main"
        childClassName=""
        icon={CallMadeIcon}
        onClick={() => setCursor(3)}
        label={3}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="stroke-knock-main"
        childClassName="stroke-2 stroke-black"
        icon={RelationLineIcon}
        onClick={() => setCursor(4)}
        label={4}
        cursor={cursor}
      ></Button>
      <Button
        activeChildClassName="stroke-knock-main"
        childClassName="stroke-1 stroke-black"
        icon={FragmentLineIcon}
        onClick={() => setCursor(5)}
        label={5}
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
  label: number
  onClick: () => void
  cursor: number
}

const Button = (props: ButtonProps): JSX.Element => {

  const { onClick, cursor, label } = props

  const [hover, setHover] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(cursor === label || (cursor !== label && hover))
  }, [cursor, label, hover])

  return (
    <div className={
      clsx(
        isActive ? "border border-knock-main" : "",
        "w-full h-[30px] flex items-center justify-center cursor-pointer"
      )
    }
      onMouseEnter={() => { setHover(true) }}
      onMouseLeave={() => { setHover(false) }}
      onClick={() => onClick()}
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
