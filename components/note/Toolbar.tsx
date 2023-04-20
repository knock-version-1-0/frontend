import { useState } from "react"

import ArrowCursorIcon from '@/components/svg/ArrowCursorIcon'
import KeywordInitialIcon from '@/components/svg/KeywordInitialIcon'
import CallMadeIcon from '@mui/icons-material/CallMade'
import RelationLineIcon from '@/components/svg/RelationLineIcon'
import FragmentLineIcon from '@/components/svg/FragmentLineIcon'
import clsx from "@/utils/clsx.util"

const Toolbar = (): JSX.Element => {
  
  return (
    <div className="absolute right-0 flex flex-col items-center space-y-4 w-[30px]">
      <Button
        onHoverChildClassName="fill-knock-main"
        leaveChildClassName="fill-black"
        icon={ArrowCursorIcon}
      ></Button>
      <Button
        onHoverChildClassName="fill-knock-main"
        leaveChildClassName="fill-black"
        icon={KeywordInitialIcon}
      ></Button>
      <Button
        onHoverChildClassName="text-knock-main"
        childClassName=""
        icon={CallMadeIcon}
      ></Button>
      <Button
        onHoverChildClassName="stroke-knock-main"
        childClassName="stroke-2 stroke-black"
        icon={RelationLineIcon}
      ></Button>
      <Button
        onHoverChildClassName="stroke-knock-main"
        childClassName="stroke-1 stroke-black"
        icon={FragmentLineIcon}
      ></Button>
    </div>
  )
}

interface ButtonProps extends React.PropsWithChildren {
  onHoverChildClassName?: string
  leaveChildClassName?: string
  childClassName?: string
  icon: any
}

const Button = (props: ButtonProps): JSX.Element => {

  const [hover, setHover] = useState(false)

  return (
    <div className={
      clsx(
        hover ? "border border-knock-main" : "",
        "w-full h-[30px] flex items-center justify-center cursor-pointer"
      )
    }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Icon
        onHoverClassName={hover ? props.onHoverChildClassName : props.leaveChildClassName}
        className={props.childClassName}
        icon={props.icon}
      ></Icon>
    </div>
  )
}

interface IconProps {
  onHoverClassName?: string
  className?: string
  icon: any
}

const Icon = (props: IconProps): JSX.Element => {
  const { onHoverClassName } = props

  return (
    <props.icon
      className={clsx(props.className, onHoverClassName)}
    ></props.icon>
  )
}

export default Toolbar
