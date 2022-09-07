import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  FetchResult,
  from,
  InMemoryCache,
  Observable,
  Operation,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ThemeProvider } from "@mui/material";
import { getOperationAST, print } from "graphql";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import theme from "../theme";

type SSELinkOptions = EventSourceInit & { uri: string };

class SSELink extends ApolloLink {
  constructor(private options: SSELinkOptions) {
    super();
  }

  request(operation: Operation): Observable<FetchResult> {
    const url = new URL(this.options.uri);
    url.searchParams.append("query", print(operation.query));
    if (operation.operationName) {
      url.searchParams.append("operationName", operation.operationName);
    }
    if (operation.variables) {
      url.searchParams.append("variables", JSON.stringify(operation.variables));
    }
    if (operation.extensions) {
      url.searchParams.append(
        "extensions",
        JSON.stringify(operation.extensions)
      );
    }

    return new Observable((sink) => {
      const eventsource = new EventSource(url.toString(), this.options);
      eventsource.onmessage = function (event) {
        const data = JSON.parse(event.data);
        sink.next(data);
        if (eventsource.readyState === 2) {
          sink.complete();
        }
      };
      eventsource.onerror = function (error) {
        sink.error(error);
      };
      return () => eventsource.close();
    });
  }
}

const uri = "http://localhost:3000/api/graphql";
const sseLink = new SSELink({ uri, withCredentials: true });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri,
  credentials: "same-origin",
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          channelActivity: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  link: from([
    errorLink,
    split(
      ({ query, operationName }) => {
        const definition = getOperationAST(query, operationName);

        return (
          definition?.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      sseLink,
      httpLink
    ),
  ]),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
