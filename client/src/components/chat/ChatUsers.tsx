import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Card,
  LinearProgress,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import useWebSocket from "../../hooks/useWebSocket";
import theme from "../../theme";
import ApolloErrorAlert from "../ApolloErrorAlert";

export const GET_CHANNEL_USERS = gql`
  query GetChannelUsers($channelId: String!) {
    channelUsers(channelId: $channelId) {
      id
      name
      image
      online
    }
  }
`;

const ChatUsers = ({ channelId }: { channelId: string }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));
  const { data, loading, error } = useQuery(GET_CHANNEL_USERS, {
    variables: { channelId },
  });
  const client = useApolloClient();

  useWebSocket("user:online", (event: UserOnlineNotification) => {
    client.writeQuery({
      query: GET_CHANNEL_USERS,
      data: {
        channelUsers: [
          { ...event.user, online: event.online, __typename: "User" },
        ],
      },
      variables: { channelId },
    });
  });

  return (
    <Card
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        backgroundColor: "rgba(0,0,0,0.02)",
      }}
    >
      <List
        data-testid="user-list"
        sx={{ overflowY: "auto", minHeight: 0, p: 0 }}
      >
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

        {data?.channelUsers.map((user: User, idx: number) => (
          <ListItem
            data-testid={`user-list-${idx}`}
            key={`user-${idx}`}
            sx={{ p: 0.5 }}
          >
            <Avatar
              data-testid={`user-avatar-${idx}`}
              sx={{
                width: "32px",
                height: "32px",
                mr: 1,
                ...(user.online
                  ? {}
                  : {
                      opacity: 0.4,
                      filter: "alpha(opacity=40)",
                    }),
              }}
              alt={user.name || ""}
              src={user.image || ""}
            />
            {mdBreakpoint && (
              <Typography
                color={user.online ? "inherit" : "lightGrey"}
                data-testid={`user-name-${idx}`}
                variant="subtitle2"
              >
                {user.name}
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
export default ChatUsers;
