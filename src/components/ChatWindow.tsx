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
import { useState } from "react";
import { useSession } from "next-auth/react";

type IMessage = {
  timestamp: Date;
  username: string;
  text: string;
};

const Message = ({ message }: { message: IMessage }) => {
  return (
    <Box sx={{ pr: 1, wordBreak: "break-all" }}>
      <Typography sx={{ mr: 1, ...theme.chat.timestamp }} component="span">
        [
        {message.timestamp.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
        ]
      </Typography>
      <Typography sx={{ mr: 1, ...theme.chat.username }} component="span">
        {message.username}
      </Typography>
      <Typography sx={{ ...theme.chat.message }} component="span">
        {message.text}
      </Typography>
    </Box>
  );
};

const ChatWindow = () => {
  const { data: session, status } = useSession();
  const [command, setCommand] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const handleSendChat = () => {
    if (command.trim().length > 0) {
      setMessages([
        ...messages,
        {
          timestamp: new Date(),
          username: session?.user?.name || "Anonymous",
          text: command.trim(),
        },
      ]);
    }
    setCommand("");
  };

  if (status === "loading") return null;

  return (
    <Paper variant="elevation">
      <Box p={1}>
        <Typography variant="subtitle2">Chat</Typography>
      </Box>
      <Divider />
      <Box sx={{ minHeight: "300px" }}>
        <List>
          {messages.map((message, idx) => (
            <ListItem key={`message-${idx}`} sx={{ p: 0, pl: 1 }}>
              <Message message={message} />
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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendChat();
          }}
        />
      </Box>
    </Paper>
  );
};
export default ChatWindow;
