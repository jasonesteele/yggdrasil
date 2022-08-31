import { Box, Typography } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatMessage = ({ message }: { message: any }) => {
  return (
    <Box sx={{ pr: 1, wordBreak: "break-all" }}>
      <Typography sx={{ mr: 1 }} component="span">
        [
        {new Date(message.createdAt).toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
        ]
      </Typography>
      <Typography sx={{ mr: 1 }} component="span">
        {message.user.name}
      </Typography>
      <Typography component="span">{message.text}</Typography>
    </Box>
  );
};
export default ChatMessage;
