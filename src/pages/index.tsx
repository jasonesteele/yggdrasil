import { GetServerSideProps, NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { Button } from "@mui/material";
import AppFrame from "../components/AppFrame";

const Home: NextPage = () => {
  const { status } = useSession();

  if (status === "loading") return null;

  return (
    <AppFrame
      title="Text Roleplay"
      rightButton={
        <Button onClick={() => signOut()} color="inherit">
          Logout
        </Button>
      }
    >
      <div>Home page</div>
    </AppFrame>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return session?.user
    ? {
        props: {},
      }
    : {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
};

export default Home;
