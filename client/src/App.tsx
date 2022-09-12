import { Alert, AlertTitle, Button } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSessionContext } from "./providers/SessionProvider";

const HomePage = () => {
  const { user, error } = useSessionContext();

  const handleLogout = async () => {
    await fetch("/auth/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "appliation/json",
      },
    });
    window.location.href = "/";
  };

  const handleLogin = () => {
    window.location.href = "/auth/discord";
  };

  return (
    <div>
      {error && (
        <Alert severity="error">
          <AlertTitle>Error Retrieving Session</AlertTitle>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </Alert>
      )}
      {user ? (
        <>
          <Alert severity="info">
            <AlertTitle>Session User</AlertTitle>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </Alert>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <>
          <Alert severity="warning">
            <AlertTitle>Session User</AlertTitle>
            <i>No user</i>
          </Alert>
          <Button onClick={handleLogin}>Login</Button>
        </>
      )}
    </div>
  );
};

const ChannelPage = () => {
  return <div>Channel page</div>;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/channel" element={<ChannelPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
