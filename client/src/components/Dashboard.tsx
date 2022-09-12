import { Alert, AlertTitle } from "@mui/material";
import { useSessionContext } from "../providers/SessionProvider";

const Dashboard = () => {
  const { user } = useSessionContext();

  return (
    <div>
      {user && (
        <>
          <Alert severity="info">
            <AlertTitle>Session User</AlertTitle>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </Alert>
        </>
      )}
    </div>
  );
};
export default Dashboard;
