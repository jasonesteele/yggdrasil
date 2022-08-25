import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import AppFrame from "../components/AppFrame";
import { User } from "next-auth";
import Head from "next/head";
import ChatWindow from "../components/ChatWindow";
import { Box, Container } from "@mui/material";

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
        <Container>
          <Box m={2}>
            <ChatWindow/>
          </Box>
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
