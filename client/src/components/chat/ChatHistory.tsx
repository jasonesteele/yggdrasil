import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Card,
  LinearProgress,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../../hooks/useWebSocket";
import theme from "../../theme";
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
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_CHANNEL_MESSAGES, {
    variables: { channelId },
  });
  const client = useApolloClient();
  useWebSocket(`chat:message:${channelId}`, (event: Message) => {
    client.writeQuery({
      query: GET_CHANNEL_MESSAGES,
      data: { channelMessages: [{ ...event, __typename: "Message" }] },
      variables: { channelId },
    });
  });
  useEffect(() => {
    if (lastMessageRef.current?.scrollIntoView) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  return (
    <Card
      elevation={5}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        backgroundColor: "rgba(0,0,0,0.02)",
      }}
    >
      <List
        data-testid="chat-history"
        sx={{ p: 0, overflowY: "auto", minHeight: 0 }}
      >
        {loading && (
          <ListItem data-testid="chat-history-loading" key="progress">
            <Alert sx={{ width: "100%" }} severity="info">
              Loading...
            </Alert>
            <LinearProgress />
          </ListItem>
        )}

        {!loading && error && (
          <ListItem data-testid="chat-history-error" key="error">
            <ApolloErrorAlert title="Error loading messages" error={error} />
          </ListItem>
        )}
        {data?.channelMessages.map((message: Message, idx: number) => (
          <ListItem
            data-testid={`chat-message-${idx}`}
            key={`message-${idx}`}
            sx={{ p: 0, m: 0 }}
          >
            <Box display="flex" sx={{ width: "100%" }} alignItems="flex-start">
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
              <Typography
                sx={{
                  ml: 1,
                  "&:hover": {
                    background: "rgba(0,0,0,0.05)",
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  navigate(`/user/${message.user.id}`);
                }}
              >
                <b>{message.user.name || <i>anonymous</i>}</b>
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
        ))}
        <div ref={lastMessageRef} />
      </List>
    </Card>
  );
};
export default ChatHistory;
