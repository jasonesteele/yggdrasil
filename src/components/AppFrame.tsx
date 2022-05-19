import React, { ReactElement } from "react";
import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import DiscordIcon from "./icons/DiscordIcon";
import { User } from "next-auth";
import YggdrasilIcon from "./icons/YggdrasilIcon";
import UserProfileButton from "./UserProfileButton";

type AppFrameProps = {
  title: string;
  user?: User;
  children?: ReactElement;
};

const AppFrame = ({ children, title }: AppFrameProps) => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <>
      <AppBar
        position="fixed"
        // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
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
      {children}
    </>
  );
};

export default AppFrame;
