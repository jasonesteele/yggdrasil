import { ApolloError, gql, useQuery } from "@apollo/client";
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

type User = {
  id: string;
  name: string;
  image?: string;
};

type Session = {
  user?: User;
  error?: ApolloError;
};

const SessionContext = createContext<Session>({});

export const useSessionContext = () => useContext(SessionContext);

const SessionProvider = ({ children }: { children: JSX.Element }) => {
  const { data, error } = useQuery(GET_CURRENT_USER);
  return (
    <SessionContext.Provider value={{ user: data?.currentUser, error }}>
      {children}
    </SessionContext.Provider>
  );
};
export default SessionProvider;
