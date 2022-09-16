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
import { handleLogout, useSessionContext } from "../providers/SessionProvider";

const drawerWidth = 250;
const avatarSize = 128;

const UserProfileButton = () => {
  const { user } = useSessionContext();
  const [openProfile, setOpenProfile] = useState(false);

  if (!user) return null;

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
      data-testid="user-profile-button"
    >
      <Avatar alt={user.name || "User"} src={user.image || ""} />
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
          data-testid="user-profile-container"
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          sx={{ padding: 2 }}
        >
          <Grid container direction="column" alignItems="center" spacing="20">
            <Grid container direction="column" item alignItems="center">
              <Avatar
                sx={{ width: avatarSize, height: avatarSize }}
                src={user.image || ""}
              />
              <Typography variant="h6">{user.name}</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                data-testid="logout-button"
                onClick={handleLogout}
              >
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
