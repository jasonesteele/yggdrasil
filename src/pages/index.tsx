import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import AppFrame from "../components/AppFrame";
import { User } from "next-auth";
import Head from "next/head";

type HomeProps = {
  appTitle: string;
};

const Home: NextPage<HomeProps> = ({ appTitle }) => {
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") return null;

  return (
    <>
      <Head>
        <title>{appTitle} - Home</title>
      </Head>
      <AppFrame title={appTitle} user={session?.user as User}>
        <div>Home page</div>
      </AppFrame>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      appTitle: process.env.APP_TITLE,
    },
  };
};

export default Home;
