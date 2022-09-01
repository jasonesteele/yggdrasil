import {
  Avatar,
  Box,
  Card,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import theme from "src/theme";

import { MAX_MESSAGE_LENGTH } from "src/util/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatHistory = ({ messages }: { messages: any[] }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Card sx={{ overflow: "auto", height: "100%" }}>
      <List>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {messages.map((message: any, idx: number) => (
          <ListItem key={`message-${idx}`} sx={{ p: 0.75 }}>
            <Box display="flex" sx={{ width: "100%" }} alignItems="baseline">
              <Typography>
                <b>{message.user.name}</b>
              </Typography>
              <Typography sx={{ ml: 1 }} color={theme.palette.text.secondary}>
                {message.text}
              </Typography>{" "}
              {mdBreakpoint && (
                <Typography flexGrow={1} variant="caption" textAlign="right">
                  {new Date(message.createdAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Typography>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatUsers = ({ users }: { users: any[] }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Card sx={{ overflow: "auto", height: "100%" }}>
      <List>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {users.map((user: any, idx: number) => (
          <ListItem key={`user-${idx}`} sx={{ p: 0.75 }}>
            <Avatar
              sx={{ width: "32px", height: "32px", mr: 1 }}
              alt={user?.name || "User"}
              src={user?.image || null}
            />
            {mdBreakpoint && (
              <Link>
                <Typography variant="subtitle2">
                  {user?.name || "User"}
                </Typography>
              </Link>
            )}
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

const ChatCommandField = ({ channelId }: { channelId: string }) => {
  const [command, setCommand] = useState<string>("");

  const handleSendCommand = async () => {
    if (command.trim().length > 0) {
      console.log(`sending ${command} to channel ${channelId}`);
    }
  };

  return (
    <Box>
      <div style={{ position: "relative" }}>
        <TextField
          fullWidth
          value={command}
          placeholder="Type message or / command"
          variant="outlined"
          size="small"
          name="chat"
          data-cy="chat-command-input"
          sx={{ backgroundColor: theme.palette.background.paper }}
          inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
          onChange={(e) => {
            setCommand(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendCommand();
            }
          }}
        />
      </div>
    </Box>
  );
};

const ChatStatusBar = () => {
  return (
    <Box p={0.5}>
      <Typography variant="caption">Shaza is typing</Typography>
    </Box>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatChannel = ({ channel }: { channel: any }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  if (!channel) return null;

  return (
    <Box display="flex" flexDirection="column" sx={{ height: "400px" }}>
      <Box display="flex" flexGrow={1}>
        <Box flexGrow={1}>
          <ChatHistory messages={channel.messages} />
        </Box>
        <Box
          sx={{
            pl: 1,
            width: mdBreakpoint ? "200px" : "48px",
            height: "100%",
          }}
          justifyContent="flex-end"
        >
          <ChatUsers users={channel.users} />
        </Box>
      </Box>
      <Box pt={1}>
        <ChatCommandField channelId={channel.id} />
      </Box>
      <ChatStatusBar />
    </Box>
  );
};
export default ChatChannel;
