import { gql, useQuery } from "@apollo/client";
import { WifiTethering, WifiTetheringError } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import moment from "moment";
import converter from "number-to-words";
import { useEffect } from "react";
import { NexusGenRootTypes } from "src/nexus-typegen";

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

const ChatStatusBar = ({ channelId }: { channelId: string }) => {
  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_CHANNEL_ACTIVITY,
    {
      variables: { channelId },
    }
  );

  const activity =
    data?.channelActivity?.filter(
      (user: NexusGenRootTypes["User"]) =>
        moment().diff(moment(user.lastActivity), "seconds") < 5
    ) || [];

  useEffect(() => {
    startPolling(500);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const formatActivityMessage = () => {
    if (activity.length === 0) return " ";
    else if (activity.length === 1) return `${activity[0].name} is typing...`;
    else if (activity.length === 2)
      return `${activity[0].name} and ${activity[1].name} are typing...`;
    else if (activity.length === 3)
      return `${activity[0].name}, ${activity[1].name} and ${activity[2].name} are typing...`;
    else
      return `${activity[0].name}, ${activity[1].name} and ${converter.toWords(
        activity.length - 2
      )} others are typing...`;
  };

  return (
    <Box p={0.5} display="flex">
      <Typography
        flexGrow={1}
        data-testid="chat-status-activity"
        variant="caption"
      >
        {formatActivityMessage()}
      </Typography>
      <IconButton disabled={true}>
        {!loading && !error ? (
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
