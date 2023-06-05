"use client";

import * as React from "react"
import { SVGProps } from "react"

interface Props extends SVGProps<SVGSVGElement> {
  className?: string
}

const FragmentLineIcon = (props: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    {...props}
  >
    <path
      strokeDasharray="2 2"
      strokeLinecap="square"
      d="M1 12.293 11.607 1.686"
    />
  </svg>
)

export default FragmentLineIcon
