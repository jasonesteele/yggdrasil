import { Box, useMediaQuery } from "@mui/material";
import { useState } from "react";
import theme from "src/theme";
import ChatCommandField from "./ChatCommandField";
import ChatHistory from "./ChatHistory";
import ChatStatusBar from "./ChatStatusBar";
import ChatUsers from "./ChatUsers";

const ChatChannel = ({ channelId }: { channelId: string }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));
  const [connected, setConnected] = useState(false);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" flexGrow={1} minHeight="100px">
        <Box minHeight={0} flexGrow={1}>
          <ChatHistory
            channelId={channelId}
            onConnect={(isConnected) => setConnected(isConnected)}
          />
        </Box>
        <Box
          sx={{
            minHeight: 0,
            pl: 1,
            width: mdBreakpoint ? "200px" : "48px",
          }}
          justifyContent="flex-end"
        >
          <ChatUsers channelId={channelId} />
        </Box>
      </Box>
      <Box m={0} p={0} pt={1}>
        <ChatCommandField channelId={channelId} />
        <ChatStatusBar channelId={channelId} connected={connected} />
      </Box>
    </Box>
  );
};
export default ChatChannel;
