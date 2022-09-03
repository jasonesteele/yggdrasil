import { WifiTethering, WifiTetheringError } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import moment from "moment";
import { NexusGenRootTypes } from "src/nexus-typegen";
import converter from "number-to-words";

const ChatStatusBar = ({
  activity = [],
  connected = false,
}: {
  activity: NexusGenRootTypes["User"][];
  connected: boolean;
}) => {
  const _activity = activity.filter(
    (user) => moment().diff(moment(user.lastActivity, "seconds")) < 5
  );

  const formatActivityMessage = () => {
    if (_activity.length === 0) return " ";
    else if (_activity.length === 1) return `${_activity[0].name} is typing...`;
    else if (_activity.length === 2)
      return `${_activity[0].name} and ${_activity[1].name} are typing...`;
    else if (_activity.length === 3)
      return `${_activity[0].name}, ${_activity[1].name} and ${_activity[2].name} are typing...`;
    else
      return `${_activity[0].name}, ${
        _activity[1].name
      } and ${converter.toWords(_activity.length - 2)} others are typing...`;
  };

  return (
    <Box p={0.5}>
      <Typography data-testid="chat-status-activity" variant="caption">
        {formatActivityMessage()}
      </Typography>
      <IconButton disabled={true}>
        {connected ? (
          <WifiTethering color="success" data-testid="chat-status-connected" />
        ) : (
          <WifiTetheringError
            color="success"
            data-testid="chat-status-disconnected"
          />
        )}
      </IconButton>
    </Box>
  );
};
export default ChatStatusBar;
