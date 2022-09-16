import { WifiTethering, WifiTetheringError } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import moment from "moment";
import converter from "number-to-words";
import { useState } from "react";
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

  /* Bit of extra handling of transient state required to handle
   * potentially multiple notifications arriving in the same
   *  component render cycle.
   */
  let pendingActive: ActivityNotification[] = [];
  let pendingInactive: ActivityNotification[] = [];

  const handleEvent = (event: ActivityNotification) => {
    if (event.channelId !== channelId) return;

    pendingActive = [
      ...pendingActive.filter((activity) => activity.user.id !== event.user.id),
      ...(event.active ? [event] : []),
    ];
    pendingInactive = [
      ...pendingInactive.filter(
        (activity) => activity.user.id !== event.user.id
      ),
      ...(event.active ? [] : [event]),
    ];

    setActivities([
      ...activities.filter(
        (activity) =>
          !pendingInactive.find(
            (inactive) => activity.user.id === inactive.user.id
          ) &&
          !pendingActive.find((active) => activity.user.id === active.user.id)
      ),
      ...pendingActive,
    ]);
  };
  const { isConnected } = useWebSocket("chat:activity", handleEvent);

  useInterval(async () => {
    const freshActivities = activities.filter(
      (activity) =>
        moment().diff(activity.timestamp, "seconds") < MAX_IDLE_SECONDS
    );
    if (freshActivities.length !== activities.length) {
      setActivities(freshActivities);
    }
  }, 1000);

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
          <WifiTethering color="success" data-testid="chat-status-connected" />
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
