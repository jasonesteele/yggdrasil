import { Alert } from "@mui/material";
import { signIn } from "next-auth/react";

const AccessDenied = () => {
  return (
    <>
      <Alert severity="error" title="Access Denied">
        <a
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          You must be signed in to view this page
        </a>
      </Alert>
    </>
  );
};
export default AccessDenied;
