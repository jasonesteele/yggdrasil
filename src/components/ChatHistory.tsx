import {
  Box,
  Card,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "src/theme";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatHistory = ({ messages }: { messages: any[] }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Card sx={{ overflow: "auto", height: "100%" }}>
      <List sx={{ p: 0 }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {messages.map((message: any, idx: number) => (
          <ListItem key={`message-${idx}`} sx={{ p: 0.5, pt: 0, pb: 0 }}>
            <Box display="flex" sx={{ width: "100%" }} alignItems="flex-start">
              {mdBreakpoint && (
                <Typography variant="caption" sx={{ mt: 0.4 }}>
                  {new Date(message.createdAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Typography>
              )}
              <Typography sx={{ ml: 1 }}>
                <b>{message.user.name}</b>
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
