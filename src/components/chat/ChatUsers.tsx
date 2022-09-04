import { gql, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Card,
  LinearProgress,
  Link,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect } from "react";
import { NexusGenRootTypes } from "src/nexus-typegen";
import theme from "src/theme";
import ApolloErrorAlert from "../ApolloErrorAlert";

export const GET_CHANNEL_USERS = gql`
  query GetChannelUsers($channelId: String!) {
    channelUsers(channelId: $channelId) {
      id
      name
      image
    }
  }
`;

const ChatUsers = ({ channelId }: { channelId: string }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));
  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_CHANNEL_USERS,
    {
      variables: { channelId },
    }
  );

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  return (
    <Card sx={{ overflow: "auto", height: "100%" }}>
      <List data-testid="user-list" sx={{ p: 0 }}>
        {loading && (
          <ListItem data-testid="user-list-loading" key="progress">
            <Typography variant="caption">Loading...</Typography>
            <LinearProgress />
          </ListItem>
        )}

        {!loading && error && (
          <ListItem data-testid="user-list-error" key="error">
            <Box width="100%">
              <ApolloErrorAlert title="Error loading users" error={error} />
            </Box>
          </ListItem>
        )}

        {data?.channelUsers.map(
          (user: NexusGenRootTypes["User"], idx: number) => (
            <ListItem
              data-testid={`user-list-${idx}`}
              key={`user-${idx}`}
              sx={{ p: 0.5 }}
            >
              <Avatar
                data-testid={`user-avatar-${idx}`}
                sx={{ width: "32px", height: "32px", mr: 1 }}
                alt={user.name || ""}
                src={user.image || ""}
              />
              {mdBreakpoint && (
                <Link>
                  <Typography
                    data-testid={`user-name-${idx}`}
                    variant="subtitle2"
                  >
                    {user?.name}
                  </Typography>
                </Link>
              )}
            </ListItem>
          )
        )}
      </List>
    </Card>
  );
};
export default ChatUsers;
