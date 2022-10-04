import { gql, Reference, useMutation, useQuery } from "@apollo/client";
import Add from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  LinearProgress,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cache } from "../../apollo-client";
import { SLOW_POLL_INTERVAL } from "../../constants";
import useWebSocket from "../../hooks/useWebSocket";
import { useSessionContext } from "../../providers/SessionProvider";
import { useToastContext } from "../../providers/ToastProvider";
import ApolloErrorAlert from "../ApolloErrorAlert";
import Breadcrumbs from "../util/Breadcrumbs";
import SearchInput from "../util/SearchInput";
import WorldCard from "./WorldCard";

export const GET_WORLDS = gql`
  query GetWorlds {
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
      users {
        id
        name
        image
      }
    }
  }
`;

export const DELETE_WORLD = gql`
  mutation DeleteWorld($worldId: String!) {
    deleteWorld(worldId: $worldId) {
      success
    }
  }
`;

const WorldBrowser = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_WORLDS,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const { showToast } = useToastContext();
  const [deleteWorld] = useMutation(DELETE_WORLD);
  const [myWorlds, setMyWorlds] = useState(false);
  const { user } = useSessionContext();

  useWebSocket(`world:membership`, (event: WorldMembershipEvent) => {
    const user = cache.readFragment({
      id: `User:${event.user.id}`,
      fragment: gql`
        fragment NewUser on User {
          id
          name
          image
        }
      `,
    });
    cache.modify({
      id: `World:${event.world.id}`,
      fields: {
        users(existingUserRefs = [], { readField }) {
          return event.join
            ? [...existingUserRefs, user]
            : existingUserRefs.filter(
                (ref: Reference | undefined) =>
                  event.user.id !== readField("id", ref)
              );
        },
      },
    });
  });

  useEffect(() => {
    startPolling(SLOW_POLL_INTERVAL);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const filteredWorlds = data?.worlds
    ? data?.worlds
        .filter(
          (world: World) =>
            !myWorlds ||
            world.owner.id === user?.id ||
            world.users.find((worldUser) => worldUser.id === user?.id)
        )
        .filter(
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

  const handleWorldDelete = async (world: World) => {
    try {
      await deleteWorld({
        variables: { worldId: world.id },
        update(cache) {
          cache.modify({
            fields: {
              worlds(existingWorldRefs: any[], { readField }) {
                return existingWorldRefs.filter(
                  (worldRef: any) => world.id !== readField("id", worldRef)
                );
              },
            },
          });
        },
      });

      showToast({
        severity: "success",
        message: `Deleted ${world.name}`,
      });
    } catch (error) {
      showToast({ severity: "error", message: (error as any).message });
    }
  };

  const filterCaption = (): string => {
    if (filteredWorlds?.length !== data?.worlds?.length) {
      return `Displaying ${filteredWorlds.length} of ${
        data?.worlds?.length
      } world${data?.worlds?.length === 1 ? "" : "s"}`;
    } else {
      return `Displaying ${filteredWorlds.length} world${
        data?.worlds?.length === 1 ? "" : "s"
      }`;
    }
  };

  return (
    <Container sx={{ height: "100%" }}>
      <Box
        minHeight="0"
        display="flex"
        flexDirection="column"
        height="100%"
        data-testid="worlds-panel"
      >
        <Box display="flex" alignItems="flex-top">
          <Box flexGrow={1}>
            <Breadcrumbs
              path={[{ label: "Home", link: "/" }]}
              pageLabel="Worlds"
            />
          </Box>
          <Box>
            <FormGroup>
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    value={myWorlds}
                    onChange={(e) => setMyWorlds(e.target.checked)}
                    size="small"
                  />
                }
                label={myWorlds ? "Mine Only" : "All"}
              />
            </FormGroup>
          </Box>
        </Box>
        {!loading && error && (
          <ApolloErrorAlert title="Error loading worlds" error={error} />
        )}
        {!error && (
          <Box
            display="flex"
            flexDirection="column"
            height="100%"
            flexGrow="1"
            minHeight="0"
          >
            <Box display="flex">
              <SearchInput
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                dataTestId="worlds-list-search"
              />
              <IconButton
                component={Link}
                to={"/world/new"}
                title="Create a world"
                color="primary"
              >
                <Add />
              </IconButton>
            </Box>
            {loading && (
              <Box>
                <Alert sx={{ mt: 2, width: "100%" }} severity="info">
                  Loading...
                </Alert>
                <LinearProgress />
              </Box>
            )}

            {data?.worlds?.length > 0 && (
              <Box>
                <Typography variant="caption">{filterCaption()}</Typography>
              </Box>
            )}

            {!filteredWorlds.length && (
              <Alert sx={{ mt: 2, width: "100%" }} severity="info">
                No worlds found
              </Alert>
            )}
            <Box sx={{ overflowY: "auto" }}>
              <Grid container spacing={1} padding={1}>
                {filteredWorlds.map((world: World, idx: number) => (
                  <Grid key={idx} item xs={12} md={6} lg={4}>
                    <WorldCard world={world} onDelete={handleWorldDelete} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default WorldBrowser;
