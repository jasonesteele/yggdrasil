import { WifiTethering, WifiTetheringError } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import moment from "moment";
import converter from "number-to-words";
import { useEffect, useState } from "react";
import useInterval from "../../hooks/useInterval";
import useWebSocket from "../../hooks/useWebSocket";

const MAX_IDLE_SECONDS = 4;

const formatActivityMessage = (names: string[]) => {
  if (names.length === 0) return " ";
  else if (names.length === 1) return `${names[0]} is typing...`;
  else if (names.length === 2)
    return `${names[0]} and ${names[1]} are typing...`;
  else if (names.length === 3)
    return `${names[0]}, ${names[1]} and ${names[2]} are typing...`;
  else
    return `${names[0]}, ${names[1]} and ${converter.toWords(
      names.length - 2
    )} others are typing...`;
};

const ChatStatusBar = ({ channelId }: { channelId: string }) => {
  const [activities, setActivities] = useState<ActivityNotification[]>([]);
  const { isConnected, socket } = useWebSocket();

  useInterval(async () => {
    const freshActivities = activities.filter(
      (activity) =>
        moment().diff(activity.timestamp, "seconds") < MAX_IDLE_SECONDS
    );
    if (freshActivities.length !== activities.length) {
      setActivities(freshActivities);
    }
  }, 1000);

  useEffect(() => {
    const activityHandler = (event: ActivityNotification) => {
      setActivities([
        ...activities.filter((activity) => activity.user.id !== event.user.id),
        ...(event.active ? [event] : []),
      ]);
    };
    socket.on("chat:activity", activityHandler);

    return () => {
      socket.off("chat:activity", activityHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, socket]);

  return (
    <Box display="flex" alignItems="center">
      <Typography
        flexGrow={1}
        data-testid="chat-status-activity"
        variant="caption"
      >
        {formatActivityMessage(
          activities.map((activity) => activity.user.name)
        )}
      </Typography>
      <IconButton disabled={true}>
        {isConnected ? (
          <WifiTethering
            data-channelid={channelId}
            color="success"
            data-testid="chat-status-connected"
          />
        ) : (
          <WifiTetheringError
            color="error"
            data-testid="chat-status-disconnected"
          />
        )}
      </IconButton>
    </Box>
  );
};
export default ChatStatusBar;
