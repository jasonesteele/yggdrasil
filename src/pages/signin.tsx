import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import AppFrame from "../components/AppFrame";
import Head from "next/head";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";

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
        <Box m={5}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="body2">
                    “Yggdrasil is the Tree of Life,’ he says. ‘Its branches
                    cover the world and stretch up to the sky. But it has only
                    three roots. One is submerged in the waters of the Pool of
                    Knowledge. Another in fire. The last root is being devoured
                    by a terrible creature. When two of its roots have been
                    consumed by fire and beast, the tree will fall, and eternal
                    darkness will spread across the world.”
                  </Typography>
                  <Typography variant="caption">
                    Twan Eng Tan, The Garden of Evening Mists
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <List>
                <ListItem>
                  <span>
                    <Link onClick={() => signIn("discord")}>Log in</Link>
                  </span>
                </ListItem>
                <ListItem>
                  <span>
                    Join our{" "}
                    <Link href="https://discord.gg/bbSFJzk6FV"> Discord</Link>
                  </span>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Box>
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
