import { Box, useMediaQuery } from "@mui/material";
import theme from "src/theme";
import ChatCommandField from "./ChatCommandField";

import ChatHistory from "./ChatHistory";
import ChatStatusBar from "./ChatStatusBar";
import ChatUsers from "./ChatUsers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatChannel = ({ channel }: { channel: any }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  if (!channel) return null;

  return (
    <Box display="flex" flexDirection="column" height="100%">
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
