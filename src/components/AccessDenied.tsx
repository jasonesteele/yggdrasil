import { Alert } from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";

const AccessDenied = () => {
  return (
    <>
      <Alert severity="error" title="Access Denied">
        <Link
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          You must be signed in to view this page
        </Link>
      </Alert>
    </>
  );
};
export default AccessDenied;
