import { Wifi, WifiOff } from "@mui/icons-material";
import { Box, Divider, List, ListItem, Paper, Typography } from "@mui/material";
import { Message } from "@prisma/client";
import { useEffect, useRef } from "react";
import useChatMessages from "src/hooks/useChatActivity";
import theme from "../theme";
import ChatCommandField from "./ChatCommandField";
import ChatMessage from "./ChatMessage";
import ChatStatusBar from "./ChatStatusBar";

const ChatWindow = () => {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { messages, userActivity, error } = useChatMessages({
    channel: "",
  });

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
          {messages?.map((message: Message, idx: number) => (
            <ListItem key={`message-${idx}`} sx={{ p: 0, pl: 1 }}>
              <ChatMessage message={message} />
            </ListItem>
          ))}
          <div ref={lastMessageRef} />
        </List>
      </Box>
      <Divider />
      <ChatCommandField />
      <ChatStatusBar userActivity={userActivity} />
    </Paper>
  );
};
export default ChatWindow;
