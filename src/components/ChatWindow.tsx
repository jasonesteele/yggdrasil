import { gql, useQuery } from "@apollo/client";
import { Wifi, WifiOff } from "@mui/icons-material";
import { Box, Divider, List, ListItem, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { IMessage } from "src/types";
import theme from "../theme";
import ChatCommandField from "./ChatCommandField";
import ChatMessage from "./ChatMessage";
import ChatStatusBar from "./ChatStatusBar";

const GET_MESSAGES = gql`
  query Messages {
    messages {
      id
      createdAt
      text
      user {
        id
        name
        image
      }
    }
  }
`;

const GET_USER_ACTIVITY = gql`
  query UserActivity($since: DateTime) {
    userActivity(since: $since) {
      id
      name
      image
      lastActivity
    }
  }
`;

const ChatWindow = () => {
  const { loading, error, data, startPolling, stopPolling } =
    useQuery(GET_MESSAGES);
  const {
    data: userActivityData,
    startPolling: startActivityPolling,
    stopPolling: stopActivityPolling,
  } = useQuery(GET_USER_ACTIVITY);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startPolling(1000);
    startActivityPolling(1000);
    return () => {
      stopPolling();
      stopActivityPolling();
    };
  }, [startActivityPolling, startPolling, stopActivityPolling, stopPolling]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;

  return (
    <Paper variant="elevation">
      <Box p={1}>
        <div style={{ position: "relative" }}>
          <Typography variant="subtitle2">Chat</Typography>
          {error ? (
            <WifiOff
              sx={{
                color: theme.palette.error.main,
                position: "absolute",
                right: 8,
                top: 0,
              }}
            />
          ) : (
            <Wifi sx={{ position: "absolute", right: 8, top: 0 }} />
          )}
        </div>
      </Box>
      <Divider />
      <Box sx={{ height: "300px", overflow: "auto" }}>
        <List data-cy="chat-messages">
          {data?.messages?.map((message: IMessage, idx: number) => (
            <ListItem key={`message-${idx}`} sx={{ p: 0, pl: 1 }}>
              <ChatMessage message={message} />
            </ListItem>
          ))}
          <div ref={lastMessageRef} />
        </List>
      </Box>
      <Divider />
      <ChatCommandField />
      <ChatStatusBar userActivity={userActivityData?.userActivity} />
    </Paper>
  );
};
export default ChatWindow;
