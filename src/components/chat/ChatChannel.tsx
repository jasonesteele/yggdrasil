import { Box, useMediaQuery } from "@mui/material";
import { NexusGenRootTypes } from "src/nexus-typegen";
import theme from "src/theme";
import ChatCommandField from "./ChatCommandField";
import ChatHistory from "./ChatHistory";
import ChatStatusBar from "./ChatStatusBar";
import ChatUsers from "./ChatUsers";

const ChatChannel = ({
  channel,
}: {
  channel: NexusGenRootTypes["Channel"];
}) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  if (!channel) return null;

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" flexGrow={1}>
        <Box flexGrow={1} flexShrink={0}>
          <ChatHistory
            messages={channel.messages as NexusGenRootTypes["Channel"][]}
          />
        </Box>
        <Box
          sx={{
            pl: 1,
            width: mdBreakpoint ? "200px" : "48px",
            height: "100%",
          }}
          justifyContent="flex-end"
        >
          <ChatUsers users={channel.users as NexusGenRootTypes["User"][]} />
        </Box>
      </Box>
      {channel.id && (
        <>
          <Box pt={1}>
            <ChatCommandField channelId={channel.id} />
          </Box>
          <ChatStatusBar channelId={channel.id} />
        </>
      )}
    </Box>
  );
};
export default ChatChannel;
