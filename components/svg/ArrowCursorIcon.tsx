"use client";

import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  className?: string;
}

const ArrowCursorIcon = (props: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={21}
    {...props}
  >
    <path
      d="m4.33 3.139 9.33 6.16-5.044 1.263L5 14.299l-.67-11.16Z"
    />
    <path d="m7.531 11.683 2.598-1.5 4 6.928-2.598 1.5-4-6.928Z" />
    <path d="m7.031 10.817 2.598-1.5.5.866-2.598 1.5z" />
  </svg>
);

export default ArrowCursorIcon;
