"use client";

import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  className?: string;
}

const KeywordInitialIcon = (props: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={15}
    {...props}
  >
    <path
      d="M.87 15V.455h3.075v6.413h.192L9.37.455h3.686L7.66 6.967 13.121 15H9.442L5.458 9.02l-1.513 1.847V15H.87Z"
    />
  </svg>
);

export default KeywordInitialIcon;
