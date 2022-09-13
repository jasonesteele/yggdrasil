import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import DiscordIcon from "./components/icons/DiscordIcon";
import YggdrasilIcon from "./components/icons/YggdrasilIcon";
import PageNotFound from "./components/PageNotFound";
import Signin from "./components/Signin";
import UserProfileButton from "./components/UserProfileButton";
import { handleLogin, useSessionContext } from "./providers/SessionProvider";

const App = () => {
  const { user } = useSessionContext();

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{ minHeight: 0, bgcolor: "ghostwhite" }}
    >
      <AppBar position="absolute">
        <Toolbar sx={{ height: "64px" }}>
          <Box display="flex" alignItems="center" width="100%">
            <Box flexShrink={0}>
              <YggdrasilIcon width="48" display="block" />
            </Box>
            <Box flexGrow={1} p={1}>
              <Typography component="span" variant="h5">
                Yggdrasil
              </Typography>
            </Box>
            <Box>
              {user ? (
                <UserProfileButton />
              ) : (
                <Button
                  color="inherit"
                  aria-label="login"
                  data-testid="discord-login-button"
                  sx={{ mr: 2 }}
                  onClick={handleLogin}
                >
                  <DiscordIcon width="32" />
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ height: "64px" }} />
      <Box flexGrow={1} sx={{ minHeight: 0 }} p={0.5} pt={1.5}>
        <Router>
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Signin />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </Box>
    </Box>
  );
};

export default App;
