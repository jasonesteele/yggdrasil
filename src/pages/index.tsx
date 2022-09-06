import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ChatPanel from "src/components/chat/ChatPanel";
import WorldList from "src/components/world/WorldList";
import AppFrame from "../components/AppFrame";

type HomeProps = {
  appTitle: string;
};

const Home: NextPage<HomeProps> = ({ appTitle }) => {
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") return null;

  return (
    <Box>
      <Head>
        <title>{appTitle} - Home</title>
      </Head>
      <AppFrame title="Testing" user={session?.user as User}>
        <Stack display="flex" flexDirection="column" spacing={1} height="100%">
          <Box flex="0 1 auto" p={0.5}>
            <WorldList />
          </Box>
          <Box flex="1 1 auto" minHeight="0" p={0.5}>
            <ChatPanel />
          </Box>
        </Stack>
      </AppFrame>
    </Box>
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
