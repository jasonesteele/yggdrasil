import { gql, useQuery } from "@apollo/client";
import { Alert, Box, LinearProgress, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import ChatChannel from "./ChatChannel";
import ApolloErrorAlert from "../ApolloErrorAlert";
import { a11yProps } from "../TabPanel";

export const GET_SUBSCRIBED_CHANNELS = gql`
  query GetGlobalChannel {
    subscribedChannels {
      id
      name
    }
  }
`;

const ChatPanel = () => {
  const { data, loading, error } = useQuery(GET_SUBSCRIBED_CHANNELS);
  const [channel, setChannel] = useState<number>(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setChannel(newValue);
  };

  const selectedChannel =
    data?.subscribedChannels?.length > 0
      ? data?.subscribedChannels[channel]
      : undefined;

  return (
    <Box height="100%" minHeight="0" display="flex" flexDirection="column">
      <Box flexGrow={0}>
        {!data?.subscribedChannels?.length ? (
          <>
            <Tab
              value={0}
              disabled={true}
              label="No channels"
              {...a11yProps(0)}
            />
          </>
        ) : (
          <Tabs
            variant="scrollable"
            value={channel}
            onChange={handleChange}
            aria-label="chat-channel"
          >
            {data?.subscribedChannels?.map((channel: Channel, idx: number) => (
              <Tab
                key={channel.id}
                value={idx}
                label={channel.name}
                {...a11yProps(idx)}
              />
            ))}
          </Tabs>
        )}
      </Box>
      <Box flexGrow={1} minHeight={0}>
        {loading && (
          <>
            <Alert severity="info">Loading chat channels...</Alert>
            <LinearProgress />
          </>
        )}
        {!loading && error && (
          <ApolloErrorAlert
            title="Error retrieving subscribed channels"
            error={error}
          />
        )}
        {!loading && !error && !data?.subscribedChannels?.length && (
          <Alert severity="warning">No subscribed channels</Alert>
        )}
        {selectedChannel && <ChatChannel channelId={selectedChannel.id} />}
      </Box>
    </Box>
  );
};
export default ChatPanel;
