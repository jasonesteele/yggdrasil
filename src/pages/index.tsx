import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AccessDenied from "../components/AccessDenied";
import { Button, Typography } from "@mui/material";

const Home: NextPage = () => {
  const { data: session, status } = useSession({ required: true });
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (session?.user) {
      (async () => {
        const response = await fetch("/api/hello", {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          redirect: "follow",
          referrerPolicy: "no-referrer",
        })
          .then(async (response) => {
            const responseJson = await response.json();
            if (!response.ok) {
              throw new Error(responseJson.message);
            }
            return responseJson;
          })
          .catch((error) => {
            throw new Error(`Request failure: ${error.message}`);
          });
        setToken(response);
      })();
    }
  }, [session?.user]);

  if (status === "loading") return null;
  if (!session?.user) return <AccessDenied />;

  return (
    <>
      <Typography variant="h3">Welcome {session.user.name}!</Typography>
      <Typography variant="h5">Token</Typography>
      <pre>{JSON.stringify(token, null, 2)}</pre>
      <Typography variant="h5">user</Typography>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <div>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    </>
  );
};

export default Home;
