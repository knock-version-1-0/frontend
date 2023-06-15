import Link from "next/link";

import Layout from "@/components/Layout";

const Page = () => {
  return (
    <>
      <Layout sideScreenBody={(
        <div className="flex flex-col space-y-2 w-full h-full items-center justify-center">
          <p className="text-lg">Sorry, the page is not found</p>
          <Link href="/" className="underline">Go home</Link>
        </div>
      )}
      >
        <></>
      </Layout>
    </>
  );
}

export default Page;
