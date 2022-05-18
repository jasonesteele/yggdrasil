import React, { ReactElement } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import DiscordIcon from "./icons/DiscordIcon";
import { User } from "next-auth";

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
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
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

export default AppFrame;
