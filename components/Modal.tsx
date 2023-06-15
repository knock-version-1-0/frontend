"use client";

import { useRouter } from "next/navigation";

import clsx from "@/utils/clsx.util";

interface ModalProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClick }) => {
  const router = useRouter();

  return (
    <div
      className={clsx(
        "modal-transparent",
        "absolute flex items-center justify-center w-screen h-screen bg-etc z-20"
      )}
      onClick={(e) => {
        e.preventDefault();
        if (e.target !== e.currentTarget) return;
        onClick ? onClick() : router.back();
      }}
    >
      <div
        className="z-50"
      >
        { children }
      </div>
    </div>
  );
}

export default Modal;
