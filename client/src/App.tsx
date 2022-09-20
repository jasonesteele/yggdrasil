import { ApolloError } from "@apollo/client";
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import ApolloErrorAlert from "./components/ApolloErrorAlert";
import Dashboard from "./components/Dashboard";
import DiscordIcon from "./components/icons/DiscordIcon";
import YggdrasilIcon from "./components/icons/YggdrasilIcon";
import PageNotFound from "./components/PageNotFound";
import UserList from "./components/user/UserList";
import UserProfile from "./components/user/UserProfile";
import UserProfileButton from "./components/UserProfileButton";
import CreateWorld from "./components/world/CreateWorld";
import WorldBrowser from "./components/world/WorldBrowser";
import { handleLogin, useSessionContext } from "./providers/SessionProvider";

const notAuthorizedError = (error: ApolloError) =>
  error?.graphQLErrors?.length > 0 &&
  (error.graphQLErrors[0] as any).message === "Not authorized";

const App = () => {
  const { user, error } = useSessionContext();

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{ minHeight: 0, bgcolor: "ghostwhite" }}
    >
      {error && !notAuthorizedError(error) && (
        <Backdrop
          open={true}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Container maxWidth="sm">
            <ApolloErrorAlert
              title="Unable to communicate with the server"
              error={error}
            />
          </Container>
        </Backdrop>
      )}
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
              <Route path="/user" element={<UserList />} />
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
