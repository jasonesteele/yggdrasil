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
      <AppFrame title={appTitle} user={session?.user as User}>
        <Box display="flex" height="100%" flexDirection="column">
          <Box flex="0 0 auto">
            <WorldList />
          </Box>
          <Box pt={2} flex="1 0 auto">
            <ChatPanel />
          </Box>
        </Box>
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
