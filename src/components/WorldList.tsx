import { ApolloError, gql, ServerError, useQuery } from "@apollo/client";
import {
  Alert,
  AlertTitle,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import WorldCard from "./WorldCard";

const GET_WORLDS = gql`
  query Worlds {
    worlds {
      id
      name
      description
      owner {
        id
        name
        image
      }
    }
  }
`;

const ApolloErrorAlert = ({
  title,
  error,
}: {
  title: string;
  error: ApolloError;
}) => {
  return (
    <Alert severity="error" sx={{ maxHeight: "200px", overflow: "auto" }}>
      <AlertTitle>{title}</AlertTitle>
      <List sx={{ p: 0 }}>
        {error.graphQLErrors &&
          error.graphQLErrors.map(({ message }, idx) => (
            <ListItem key={`graphql-error-${idx}`} sx={{ p: 0 }}>
              {message}
            </ListItem>
          ))}
        {error.networkError &&
          (error.networkError as ServerError).result.errors.map(
            ({ message }: { message: string }, idx: number) => (
              <ListItem key={`network-error-${idx}`} sx={{ p: 0 }}>
                {message}
              </ListItem>
            )
          )}
      </List>
    </Alert>
  );
};

const WorldList = () => {
  const { loading, error, data, startPolling, stopPolling } =
    useQuery(GET_WORLDS);

  useEffect(() => {
    startPolling(10000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const handleSelectWorld = (worldId: string) => {
    console.log(`Selected ${worldId}...`);
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Worlds</Typography>
          {loading && <CircularProgress />}
        </Grid>
        {error && (
          <Grid item xs={12}>
            <ApolloErrorAlert title="Error retrieving worlds" error={error} />
          </Grid>
        )}
        {data?.worlds?.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.worlds.map((world: any, idx: number) => (
            <Grid key={`grid-${idx}`} item xs={12} md={6}>
              <WorldCard world={world} onSelect={handleSelectWorld} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">No worlds available</Alert>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
export default WorldList;
