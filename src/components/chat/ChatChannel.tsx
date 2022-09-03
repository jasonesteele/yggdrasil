import { Box, useMediaQuery } from "@mui/material";
import theme from "src/theme";
import ChatCommandField from "./ChatCommandField";
import ChatHistory from "./ChatHistory";
import ChatStatusBar from "./ChatStatusBar";
import ChatUsers from "./ChatUsers";

const ChatChannel = ({ channelId }: { channelId: string }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" flexGrow={1}>
        <Box flexGrow={1} flexShrink={0}>
          <ChatHistory channelId={channelId} />
        </Box>
        <Box
          sx={{
            pl: 1,
            width: mdBreakpoint ? "200px" : "48px",
            height: "100%",
          }}
          justifyContent="flex-end"
        >
          <ChatUsers channelId={channelId} />
        </Box>
      </Box>
      <Box pt={1}>
        <ChatCommandField channelId={channelId} />
      </Box>
      <ChatStatusBar channelId={channelId} />
    </Box>
  );
};
export default ChatChannel;
