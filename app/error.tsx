"use client";

import Layout from "@/components/Layout";

const Page = () => {
  return (
    <>
      <Layout sideScreenBody={(
        <div className="flex flex-col space-y-2 w-full h-full items-center justify-center">
          <p className="text-lg">Sorry, some error found</p>
        </div>
      )}
      >
        <></>
      </Layout>
    </>
  );
}

export default Page;
