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
export default ChatHistory;
