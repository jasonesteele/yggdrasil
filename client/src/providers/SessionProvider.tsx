import { gql, useQuery } from "@apollo/client";
import { createContext, useContext } from "react";

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

const SessionProvider = ({ children }: { children: JSX.Element }) => {
  const { data, loading, error } = useQuery(GET_CURRENT_USER);
  return (
    <SessionContext.Provider
      value={{ user: data?.currentUser, loading, error }}
    >
      {children}
    </SessionContext.Provider>
  );
};
export default SessionProvider;
