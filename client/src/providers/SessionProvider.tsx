import { ApolloError, gql, useQuery } from "@apollo/client";
import { createContext, useContext, useEffect } from "react";
import { SESSION_POLL_PERIOD } from "../constants";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      image
    }
  }
`;

const SessionContext = createContext<SessionContextData>({});

export const useSessionContext = () => useContext(SessionContext);

export const handleLogout = async () => {
  await fetch("/auth/logout", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "appliation/json",
    },
  });
  window.location.href = "/";
};

export const handleLogin = () => {
  window.location.href = "/auth/discord";
};

export const notAuthorizedError = (error: ApolloError) =>
  error?.graphQLErrors?.length > 0 &&
  (error.graphQLErrors[0] as any).message === "Not authorized";

const SessionProvider = ({ children }: { children: JSX.Element }) => {
  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_CURRENT_USER,
    { fetchPolicy: "network-only" }
  );

  useEffect(() => {
    startPolling(SESSION_POLL_PERIOD);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  return (
    <SessionContext.Provider
      value={{
        user: (!error || !notAuthorizedError(error)) && data?.currentUser,
        loading,
        error,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
export default SessionProvider;
