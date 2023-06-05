"use client";

import Layout from "@/components/Layout";
import AuthForm from "@/components/login/AuthForm";
import EmailForm from "@/components/login/EmailForm";

interface Props {
  sessionId?: string;
  email?: string;
}

const ClientPage: React.FC<Props> = ({ sessionId, email }) => {
  return (
    <>
      <Layout sideScreenBody={(
        sessionId ?
          <AuthForm sessionId={sessionId} email={email!} /> :
          <EmailForm />
      )}
      >
        <></>
      </Layout>
    </>
  );
}

export default ClientPage;
