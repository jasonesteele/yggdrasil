import { Box, Typography } from "@mui/material";
import { User } from "@prisma/client";

const MAX_ACTIVITY_USERS = 3;

const typingMessage = (userActivity: User[]) => {
  return `${userActivity
    .slice(0, MAX_ACTIVITY_USERS)
    .map(({ name }) => name)
    .join(", ")} ${
    userActivity.length > MAX_ACTIVITY_USERS
      ? `and ${userActivity.length - MAX_ACTIVITY_USERS} more`
      : ""
  } ${userActivity.length === 1 ? "is" : "are"} typing`;
};

const ChatStatusBar = ({ userActivity }: { userActivity: User[] }) => {
  return (
    <Box sx={{ p: "0.5em" }}>
      {userActivity.length > 0 ? (
        <Typography variant="caption">{typingMessage(userActivity)}</Typography>
      ) : (
        <Typography variant="caption">&nbsp;</Typography>
      )}
    </Box>
  );
};
export default ChatStatusBar;
