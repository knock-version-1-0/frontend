"use client";

import { useRouter } from "next/navigation";

import Modal from "@/components/Modal";

const ClientPage: React.FC = () => {
  const router = useRouter();

  return (
    <Modal>
      <div className="flex flex-col items-center justify-between w-full mx-4 sm:mx-0 sm:w-[400px] bg-white rounded-md">
        <div className="flex items-center justify-center h-full my-10">
          <p className="text-base sm:text-lg">Are you sure do you want to logout?</p>
        </div>
        <div className="flex flex-row w-full text-white text-center">
          <button className="w-1/2 py-2 border-2 border-white bg-knock-main hover:bg-knock-sub"
            onClick={() => {
              router.push('/auth/logout');
            }}
          >
            Yes
          </button>
          <button className="w-1/2 py-2 border-2 border-white bg-knock-main hover:bg-knock-sub"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ClientPage;
