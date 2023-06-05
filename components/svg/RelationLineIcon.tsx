"use client";

import * as React from "react"
import { SVGProps } from "react"

interface Props extends SVGProps<SVGSVGElement> {
  className?: string
}

const RelationLineIcon = (props: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    {...props}
  >
    <path d="m1.293 12.293 11-11" />
  </svg>
)

export default RelationLineIcon
