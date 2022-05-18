import { GetServerSideProps, NextPage } from "next";
import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  useSession,
} from "next-auth/react";
import { Button } from "@mui/material";
import DiscordIcon from "../components/icons/DiscordIcon";
import AppFrame from "../components/AppFrame";

const Signin: NextPage = () => {
  const { status } = useSession();

  if (status === "loading") return null;

  return (
    <AppFrame
      title="Text Roleplay"
      rightButton={
        <Button
          size="small"
          color="inherit"
          aria-label="login"
          sx={{ mr: 2 }}
          onClick={() => signIn("discord")}
        >
          <DiscordIcon />
        </Button>
      }
    >
      <div>Sign-in page</div>
    </AppFrame>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return session?.user
    ? {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    : {
        props: {
          providers: await getProviders(),
          csrfToken: await getCsrfToken(),
        },
      };
};

export default Signin;
