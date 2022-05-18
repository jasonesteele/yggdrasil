import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import AppFrame from "../components/AppFrame";
import Head from "next/head";

type SigninProps = {
  appTitle: string;
};

const Signin: NextPage<SigninProps> = ({ appTitle }) => {
  const { status } = useSession();

  if (status === "loading") return null;

  return (
    <>
      <Head>
        <title>{appTitle} - Signin</title>
      </Head>
      <AppFrame title={appTitle}>
        <div>Sign-in page</div>
      </AppFrame>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      appTitle: process.env.APP_TITLE,
    },
  };
};

export default Signin;
