import ClientPage from "./page.client";

const LoginPage = ({ searchParams }: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  let sessionId; let email;

  if (searchParams) {
    sessionId = searchParams['session-id'] as string;
    email = searchParams['email'] as string;
  }

  return (
    <ClientPage
      sessionId={sessionId}
      email={email}
    ></ClientPage>
  );
}

export default LoginPage;
