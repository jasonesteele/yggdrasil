import { gql, useQuery } from "@apollo/client";
import { Alert, Box, Grid } from "@mui/material";
import { useState } from "react";
import ApolloErrorAlert from "../ApolloErrorAlert";
import SearchInput from "../util/SearchInput";
import WorldCard from "./WorldCard";

export const GET_WORLDS = gql`
  query Worlds {
    worlds {
      id
      name
      description
      image
      owner {
        id
        name
        image
      }
    }
  }
`;

const WorldBrowser = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const { data, loading, error } = useQuery(GET_WORLDS);

  const filteredWorlds = data?.worlds
    ? data?.worlds.filter(
        (world: World) =>
          world.name
            .trim()
            .toLowerCase()
            .includes(searchFilter.trim().toLowerCase()) ||
          world.description
            .trim()
            .toLowerCase()
            .includes(searchFilter.trim().toLowerCase())
      )
    : [];

  return (
    <Box
      minHeight="0"
      display="flex"
      flexDirection="column"
      height="100%"
      data-testid="worlds-panel"
    >
      {loading && (
        <Box>
          <Alert sx={{ width: "100%" }} severity="info">
            Loading...
          </Alert>
        </Box>
      )}
      {!loading && error && (
        <ApolloErrorAlert title="Error loading messages" error={error} />
      )}
      {!loading && !error && (
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          flexGrow="1"
          minHeight="0"
        >
          <SearchInput
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            dataTestId="worlds-list-search"
          />
          {!filteredWorlds.length && (
            <Alert sx={{ width: "100%" }} severity="info">
              No worlds found
            </Alert>
          )}
          <Box sx={{ overflowY: "auto" }}>
            <Grid container spacing={1} padding={1}>
              {filteredWorlds.map((world: World, idx: number) => (
                <Grid key={idx} item xs={12} md={6} lg={4}>
                  <WorldCard world={world} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default WorldBrowser;
