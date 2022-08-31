import { Container } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import WorldList from "src/components/WorldList";
import AppFrame from "../components/AppFrame";

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
        <Container sx={{ p: 1 }}>
          <WorldList />
        </Container>
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
