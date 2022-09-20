import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import DiscordIcon from "./components/icons/DiscordIcon";
import YggdrasilIcon from "./components/icons/YggdrasilIcon";
import PageNotFound from "./components/PageNotFound";
import UserProfile from "./components/user/UserProfile";
import UserProfileButton from "./components/UserProfileButton";
import CreateWorld from "./components/world/CreateWorld";
import WorldBrowser from "./components/world/WorldBrowser";
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
      <Router>
        <AppBar position="absolute">
          <Toolbar sx={{ height: "64px" }}>
            <Box display="flex" alignItems="center" width="100%">
              <Box flexShrink={0}>
                <Link to="/">
                  <YggdrasilIcon width="48" display="block" />
                </Link>
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
          <Dashboard>
            <Routes>
              <Route path="/" element={<Navigate to="/world" />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/world/new" element={<CreateWorld />} />
              <Route path="/world" element={<WorldBrowser />} />
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </Dashboard>
        </Box>
      </Router>
    </Box>
  );
};

export default App;
