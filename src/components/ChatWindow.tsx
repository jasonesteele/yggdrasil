import {
  Box,
  Divider,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import theme from "../theme";
import { IMessage } from "../types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const ChatMessage = ({ message }: { message: IMessage }) => {
  return (
    <Box sx={{ pr: 1, wordBreak: "break-all" }}>
      <Typography sx={{ mr: 1, ...theme.chat.timestamp }} component="span">
        [
        {new Date(message.createdAt).toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
        ]
      </Typography>
      <Typography sx={{ mr: 1, ...theme.chat.username }} component="span">
        {message.user.name}
      </Typography>
      <Typography sx={{ ...theme.chat.message }} component="span">
        {message.text}
      </Typography>
    </Box>
  );
};

const ChatWindow = () => {
  const { status } = useSession();
  const [command, setCommand] = useState<string>("");
  const { data: messages, error } = useSWR("/api/chat/message", {
    refreshInterval: 500,
  });

  const handleSendChat = async () => {
    if (command.trim().length > 0) {
      await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: command.trim() }),
      });
    }
    setCommand("");
  };

  if (status === "loading") return null;
  if (error) {
    console.error(error);
  }

  return (
    <Paper variant="elevation">
      <Box p={1}>
        <Typography variant="subtitle2">Chat</Typography>
      </Box>
      <Divider />
      <Box sx={{ minHeight: "300px" }}>
        <List>
          {messages?.map((message: IMessage, idx: number) => (
            <ListItem key={`message-${idx}`} sx={{ p: 0, pl: 1 }}>
              <ChatMessage message={message} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box p={0.5}>
        <TextField
          fullWidth
          value={command}
          placeholder="Type message or / command"
          variant="outlined"
          size="small"
          name="chat"
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await handleSendChat();
            }
          }}
        />
      </Box>
    </Paper>
  );
};
export default ChatWindow;
