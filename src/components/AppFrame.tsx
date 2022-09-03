import React, { ReactElement } from "react";
import { AppBar, Box, Button, Grid, Toolbar, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import DiscordIcon from "./icons/DiscordIcon";
import { User } from "next-auth";
import YggdrasilIcon from "./icons/YggdrasilIcon";
import UserProfileButton from "./UserProfileButton";
import { fetch } from "cross-fetch";

type AppFrameProps = {
  title: string;
  user?: User;
  children?: ReactElement;
};

export const fetcher = (resource: RequestInfo, init: RequestInit) =>
  fetch(resource, init).then((res) => res.json());

const AppFrame = ({ children, title }: AppFrameProps) => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <AppBar position="absolute">
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <YggdrasilIcon width="48" />
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item>
              {session?.user ? (
                <UserProfileButton />
              ) : (
                <Button
                  size="small"
                  color="inherit"
                  aria-label="login"
                  sx={{ mr: 2 }}
                  onClick={() => signIn("discord")}
                >
                  <DiscordIcon />
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box flexGrow={1} p={2} pb={4}>
        {children}
      </Box>
    </Box>
  );
};

export default AppFrame;
