import React, { ReactElement } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { NextPage } from "next";

type AppFrameProps = {
  title: string;
  rightButton: React.ReactNode;
  children?: ReactElement;
};

const AppFrame: NextPage<AppFrameProps> = ({
  children,
  title,
  rightButton,
}) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {rightButton}
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

export default AppFrame;
