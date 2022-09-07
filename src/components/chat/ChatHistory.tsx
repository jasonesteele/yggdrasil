import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Card,
  LinearProgress,
  List,
  ListItem,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useEffect, useRef } from "react";
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

export const SUBSCRIBE_CHANNEL_MESSAGES = gql`
  subscription SubscribeChannelMessages($channelId: String!) {
    channelMessages(channelId: $channelId) {
      id
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
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { data, loading, error, subscribeToMore } = useQuery(
    GET_CHANNEL_MESSAGES,
    {
      variables: { channelId },
    }
  );

  useEffect(() => {
    subscribeToMore({
      document: SUBSCRIBE_CHANNEL_MESSAGES,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.channelMessages;
        return Object.assign({}, prev, {
          channelMessages: [...prev.channelMessages, newMessage],
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  useEffect(() => {
    if (lastMessageRef.current?.scrollIntoView) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <List
        data-testid="chat-history"
        sx={{ p: 0, overflowY: "auto", minHeight: 0 }}
      >
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
              sx={{ p: 0, m: 0 }}
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
        <div ref={lastMessageRef} />
      </List>
    </Card>
  );
};
export default ChatHistory;
