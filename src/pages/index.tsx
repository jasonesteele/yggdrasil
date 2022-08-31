import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import AppFrame from "../components/AppFrame";
import { User } from "next-auth";
import Head from "next/head";
import { Box, Container } from "@mui/material";
import WorldCard from "src/components/WorldCard";

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
            <WorldCard
              world={{
                id: "world123",
                name: "My World",
                description:
                  "Molestie at elementum eu facilisis sed odio morbi quis commodo odio aenean sed adipiscing diam donec adipiscing tristique risus nec.",
                owner: {
                  id: "abc123",
                  name: "Shaza",
                  image: "/yggdrasil.svg",
                },
                users: [
                  {
                    id: "char1",
                    name: "Shaza",
                    image: "/yggdrasil.svg",
                    online: true,
                  },
                  {
                    id: "char2",
                    name: "Vexa",
                    image: "/yggdrasil.svg",
                    online: true,
                  },
                ],
              }}
              onSelect={(worldId) => console.log(`selected ${worldId}`)}
            />
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
