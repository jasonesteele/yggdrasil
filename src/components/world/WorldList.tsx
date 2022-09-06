import { gql, useQuery } from "@apollo/client";
import { Close, Search } from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NexusGenObjects } from "src/nexus-typegen";
import theme from "src/theme";
import ApolloErrorAlert from "../ApolloErrorAlert";
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
    { name, description }: NexusGenObjects["World"],
    searchFilter: string
  ) =>
    (name
      ? name.toLowerCase().indexOf(searchFilter.trim().toLowerCase()) >= 0
      : false) ||
    (description
      ? description.toLowerCase().indexOf(searchFilter.trim().toLowerCase()) >=
        0
      : false);

  const filteredWorlds: NexusGenObjects["World"][] =
    data?.worlds.filter((world: NexusGenObjects["World"]) =>
      filterWorld(world, searchFilter)
    ) || [];

  return (
    <Card sx={{ height: "100%", minHeight: 0 }}>
      <Grid container sx={{ p: 1 }}>
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
            {loading && <CircularProgress size={24} sx={{ ml: "10px" }} />}{" "}
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            inputProps={{ "data-testid": "worldlist-search" }}
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
                      <IconButton
                        data-testid="worldlist-search-reset"
                        onClick={() => setSearchFilter("")}
                      >
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
        <Grid item container spacing={2} mt={1} xs={12}>
          {filteredWorlds.length > 0 ? (
            filteredWorlds.map((world, idx: number) => (
              <Grid key={`grid-${idx}`} item xs={12} md={6}>
                <WorldCard world={world} onSelect={handleSelectWorld} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="info">
                {data?.worlds?.length > 0
                  ? "No matching worlds"
                  : "No worlds available"}
              </Alert>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};
export default WorldList;
