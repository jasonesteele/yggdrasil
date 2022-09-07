import { gql } from "@apollo/client";
import { WifiTethering, WifiTetheringError } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

export const GET_CHANNEL_ACTIVITY = gql`
  query GetChannelActivity($channelId: String!, $maxAgeSeconds: Int) {
    channelActivity(channelId: $channelId, maxAgeSeconds: $maxAgeSeconds) {
      id
      name
      image
      lastActivity
    }
  }
`;

const ChatStatusBar = ({
  channelId,
  connected,
}: {
  channelId: string;
  connected: boolean;
}) => {
  // const { data, loading, error } = useQuery(GET_CHANNEL_ACTIVITY, {
  //   variables: { channelId },
  // });

  // const activity =
  //   data?.channelActivity?.filter(
  //     (user: NexusGenRootTypes["User"]) =>
  //       moment().diff(moment(user.lastActivity), "seconds") < 5
  //   ) || [];

  // const formatActivityMessage = () => {
  //   if (activity.length === 0) return " ";
  //   else if (activity.length === 1) return `${activity[0].name} is typing...`;
  //   else if (activity.length === 2)
  //     return `${activity[0].name} and ${activity[1].name} are typing...`;
  //   else if (activity.length === 3)
  //     return `${activity[0].name}, ${activity[1].name} and ${activity[2].name} are typing...`;
  //   else
  //     return `${activity[0].name}, ${activity[1].name} and ${converter.toWords(
  //       activity.length - 2
  //     )} others are typing...`;
  // };

  return (
    <Box display="flex">
      <Typography
        flexGrow={1}
        data-testid="chat-status-activity"
        variant="caption"
      >
        {/* {formatActivityMessage()} */}
      </Typography>
      <IconButton disabled={true}>
        {connected ? (
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
