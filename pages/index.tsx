import { 
  NextPage,
  GetServerSideProps,
} from "next"

import Layout from "@/components/Layout"

const HomePage: NextPage = () => {

  return (
    <Layout sideScreenBody={(
      <></>
    )}>
      <></>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  return {
    redirect: {
      permanent: false,
      destination: "/note"
    }
  }
}

export default HomePage
