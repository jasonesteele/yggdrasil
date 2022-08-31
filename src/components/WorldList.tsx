import { ApolloError, gql, ServerError, useQuery } from "@apollo/client";
import { Close, Search } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import theme from "src/theme";
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
  const [searchFilter, setSearchFilter] = useState("");
  const breakpoint = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    startPolling(10000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const handleSelectWorld = (worldId: string) => {
    console.log(`Selected ${worldId}...`);
  };

  const filterWorld = (
    { name, description }: { name: string; description: string },
    searchFilter: string
  ) =>
    name.toLowerCase().indexOf(searchFilter.trim().toLowerCase()) >= 0 ||
    description.toLowerCase().indexOf(searchFilter.trim().toLowerCase()) >= 0;

  return (
    <Paper
      sx={{ p: 1, backgroundColor: "rgba(0,0,0,0.05)", minWidth: "250px" }}
      elevation={10}
    >
      <Grid container>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{ display: "flex", flexGrow: 1 }}
            alignItems="center"
            justifyContent={breakpoint ? "inherit" : "center"}
          >
            <Typography
              component="span"
              variant={breakpoint ? "h5" : "subtitle1"}
            >
              Worlds
            </Typography>
            {loading && <CircularProgress size={24} sx={{ ml: "10px" }} />}
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            label="Search"
            size="small"
            fullWidth
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            sx={{ backgroundColor: theme.palette.background.paper }}
            InputProps={{
              endAdornment: (
                <>
                  {searchFilter.trim().length > 0 ? (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchFilter("")}>
                        <Close />
                      </IconButton>
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="end">
                      <IconButton disabled={true}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              ),
            }}
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <ApolloErrorAlert title="Error retrieving worlds" error={error} />
          </Grid>
        )}
        <Grid
          item
          container
          spacing={2}
          mt={1}
          xs={12}
          sx={{ maxHeight: "400px", overflow: "auto" }}
        >
          {data?.worlds?.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.worlds
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((world: any) => filterWorld(world, searchFilter))
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((world: any, idx: number) => (
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
      </Grid>
    </Paper>
  );
};
export default WorldList;
