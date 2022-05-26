import { signOut, useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const drawerWidth = 250;
const avatarSize = 128;

const UserProfileButton = () => {
  const { data: session, status } = useSession();
  const [openProfile, setOpenProfile] = useState(false);

  if (status === "loading") return null;

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpenProfile(open);
    };

  return (
    <IconButton
      size="large"
      aria-label="User Profile"
      onClick={toggleDrawer(!openProfile)}
      data-cy="user-profile-button"
    >
      <Avatar
        alt={session?.user?.name || "User"}
        src={session?.user?.image || ""}
      />
      <Drawer
        anchor="right"
        open={openProfile}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          sx={{ padding: 2 }}
        >
          <Grid container direction="column" alignItems="center" spacing="20">
            <Grid container direction="column" item alignItems="center">
              <Avatar
                sx={{ width: avatarSize, height: avatarSize }}
                src={session?.user?.image || ""}
              />
              <Typography variant="h6">{session?.user?.name}</Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={() => signOut()}>
                Logout
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </IconButton>
  );
};
export default UserProfileButton;
