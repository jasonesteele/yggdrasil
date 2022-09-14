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

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          channelMessages: {
            merge(existing = [], incoming: any[]) {
              return [
                ...existing,
                ...incoming.filter(
                  (incomingItem) =>
                    !existing.find(
                      (existingItem: any) =>
                        existingItem.__ref === incomingItem.__ref
                    )
                ),
              ];
            },
          },
          channelUsers: {
            merge(existing = [], incoming: any[]) {
              console.log({ existing, incoming });
              return [
                ...existing,
                ...incoming.filter(
                  (incomingItem) =>
                    !existing.find(
                      (existingItem: any) =>
                        existingItem.__ref === incomingItem.__ref
                    )
                ),
              ];
            },
          },
        },
      },
    },
  }),
  link: from([errorLink, httpLink]),
});
export default client;
