import {
  Box,
  Card,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { NexusGenRootTypes } from "src/nexus-typegen";
import theme from "src/theme";

const ChatHistory = ({
  messages,
}: {
  messages: NexusGenRootTypes["Message"][];
}) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Card
      sx={{
        overflow: "auto",
        height: "100%",
      }}
    >
      <List sx={{ p: 0 }}>
        {messages.map((message: NexusGenRootTypes["Message"], idx: number) => (
          <ListItem key={`message-${idx}`} sx={{ p: 0.5, pt: 0, pb: 0 }}>
            <Box display="flex" sx={{ width: "100%" }} alignItems="flex-start">
              {mdBreakpoint && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.4,
                    minWidth: "5em",
                    whiteSpace: "nowrap",
                    textAlign: "right",
                  }}
                >
                  {new Date(message.createdAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Typography>
              )}
              <Typography sx={{ ml: 1 }}>
                <b>{message.user?.name || <i>anonymous</i>}</b>
              </Typography>
              <Typography
                flexGrow={1}
                sx={{ ml: 1 }}
                color={theme.palette.text.secondary}
              >
                {message.text}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
export default ChatHistory;
