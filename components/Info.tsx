import { useState, useEffect } from "react"

import clsx from "@/utils/clsx.util"

interface InfoProps {
  text: string
  trigger: boolean
  className?: string
}

const Info: React.FC<InfoProps> = ({text, trigger, className}) => {
  const [isVisable, setIsVisable] = useState<boolean>(false)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (trigger) {
      setIsVisable(true)
    }
  }, [trigger])

  useEffect(() => {
    if (isVisable) {
      const intervalId = setInterval(() => {
        setOpacity((prevOpacity) => prevOpacity - 0.05);
      }, 100)

      const timerId = setTimeout(() => {
        clearInterval(intervalId)
        setIsVisable(false)
        setOpacity(1)
      }, 2500)
      return () => clearTimeout(timerId)
    }
  }, [isVisable])

  return (
    <>
      {
        isVisable && (
          <div className={clsx(
            "bg-red-200",
            className
          )}
            style={{ opacity: opacity }}
          >
            <p className="text-sm py-1 px-2 text-red-500">{text}</p>
          </div>
        )
      }
    </>
  )
}

export default Info
