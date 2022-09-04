import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Card,
  LinearProgress,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect } from "react";
import { NexusGenRootTypes } from "src/nexus-typegen";
import theme from "src/theme";
import ApolloErrorAlert from "../ApolloErrorAlert";

export const GET_CHANNEL_MESSAGES = gql`
  query GetChannelMessages($channelId: String!) {
    channelMessages(channelId: $channelId) {
      text
      createdAt
      user {
        id
        name
        image
      }
    }
  }
`;

const ChatHistory = ({ channelId }: { channelId: string }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));
  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_CHANNEL_MESSAGES,
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
    <Card
      sx={{
        overflow: "auto",
        height: "100%",
      }}
    >
      <List data-testid="chat-history" sx={{ p: 0 }}>
        {loading && (
          <ListItem data-testid="chat-history-loading" key="progress">
            <Typography variant="caption">Loading...</Typography>
            <LinearProgress />
          </ListItem>
        )}

        {!loading && error && (
          <ListItem data-testid="chat-history-error" key="error">
            <Box width="100%">
              <ApolloErrorAlert title="Error loading messages" error={error} />
            </Box>
          </ListItem>
        )}
        {data?.channelMessages.map(
          (message: NexusGenRootTypes["Message"], idx: number) => (
            <ListItem
              data-testid={`chat-message-${idx}`}
              key={`message-${idx}`}
              sx={{ p: 0.5, pt: 0, pb: 0 }}
            >
              <Box
                display="flex"
                sx={{ width: "100%" }}
                alignItems="flex-start"
              >
                {mdBreakpoint && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.4,
                      minWidth: "5em",
                      whiteSpace: "nowrap",
                      textAlign: "right",
                    }}
                  >
                    {new Date(message.createdAt).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </Typography>
                )}
                <Typography sx={{ ml: 1 }}>
                  <b>{message.user?.name || <i>anonymous</i>}</b>
                </Typography>
                <Typography
                  flexGrow={1}
                  sx={{ ml: 1 }}
                  color={theme.palette.text.secondary}
                >
                  {message.text}
                </Typography>
              </Box>
            </ListItem>
          )
        )}
      </List>
    </Card>
  );
};
export default ChatHistory;
