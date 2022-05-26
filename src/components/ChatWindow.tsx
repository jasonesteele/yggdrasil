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
import useChat from "../hooks/useChat";
import useChatHistory from "../hooks/useChatHistory";

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
  const [command, setCommand] = useState<string>("");

  const { messages, error: historyError } = useChatHistory({ numMessages: 10 });
  const { sendCommand, error: sendError } = useChat();

  const handleSendCommand = (): void => {
    if (command.trim().length > 0) {
      sendCommand(command.trim());
    }
    setCommand("");
  };

  return (
    <Paper variant="elevation">
      <Box p={1}>
        <Typography variant="subtitle2">Chat</Typography>
      </Box>
      <Divider />
      <Box sx={{ minHeight: "300px" }}>
        <List data-cy="chat-messages">
          {messages?.map((message: IMessage, idx: number) => (
            <ListItem key={`message-${idx}`} sx={{ p: 0, pl: 1 }}>
              <ChatMessage message={message} />
            </ListItem>
          ))}
          {historyError && (
            <ListItem key={"message-error"} sx={{ p: 0, pl: 1 }}>
              <Box sx={{ pr: 1, wordBreak: "break-all" }}>
                <Typography sx={{ ...theme.palette.error }}>
                  {historyError}
                </Typography>
              </Box>
            </ListItem>
          )}
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
          data-cy="chat-command-input"
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendCommand();
            }
          }}
        />
      </Box>
      {sendError && (
        <Typography sx={{ ...theme.palette.error }}>{sendError}</Typography>
      )}
    </Paper>
  );
};
export default ChatWindow;
