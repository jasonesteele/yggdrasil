import React, { ReactElement } from "react";
import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import DiscordIcon from "./icons/DiscordIcon";
import { User } from "next-auth";
import YggdrasilIcon from "./icons/YggdrasilIcon";

type AppFrameProps = {
  title: string;
  user?: User;
  children?: ReactElement;
};

const AppFrame: NextPage<AppFrameProps> = ({ children, title, user }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <YggdrasilIcon width="48" />
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item>
              {user ? (
                <Button onClick={() => signOut()} color="inherit">
                  Logout
                </Button>
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
