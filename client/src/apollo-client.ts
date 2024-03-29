import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "same-origin",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors
      .filter(({ message }) => message !== "Not authorized")
      .forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations
          )}, Path: ${path}`
        )
      );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const union = (existing = [], incoming: any[] = []) => [
  ...existing,
  ...incoming.filter(
    (incomingItem) =>
      !existing.find(
        (existingItem: any) => existingItem.__ref === incomingItem.__ref
      )
  ),
];

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        channelMessages: {
          merge: union,
        },
        channelUsers: {
          merge: union,
        },
      },
    },
  },
});

const client = new ApolloClient({
  cache,
  link: from([errorLink, httpLink]),
});
export default client;
