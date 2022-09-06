import { gql, useQuery } from "@apollo/client";
import { Alert, Box, Card, LinearProgress, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import ApolloErrorAlert from "../ApolloErrorAlert";
import { a11yProps, TabPanel } from "../TabPanel";
import ChatChannel from "./ChatChannel";

export const GET_GLOBAL_CHANNEL = gql`
  query GetGlobalChannel {
    globalChannel {
      id
      name
    }
  }
`;

const ChatPanel = () => {
  const { loading, data, error } = useQuery(GET_GLOBAL_CHANNEL);
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {loading && (
        <>
          <Alert severity="info">Loading global chat</Alert>
          <LinearProgress />
        </>
      )}
      {!loading && error && (
        <ApolloErrorAlert title="Error loading chat" error={error} />
      )}
      {!loading && !error && !data?.globalChannel && (
        <Alert severity="warning">No global channel found</Alert>
      )}

      {data?.globalChannel && (
        <Card sx={{ height: "100%", minHeight: 0 }}>
          <Box
            p={0.5}
            height="100%"
            minHeight="0"
            display="flex"
            flexDirection="column"
          >
            <Box flexGrow={0}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="chat-channel"
              >
                <Tab label={data?.globalChannel.name} {...a11yProps(1)} />
              </Tabs>
            </Box>
            <Box minHeight={0} flexGrow={1}>
              <TabPanel value={1} index={1}>
                <ChatChannel channelId={data?.globalChannel?.id} />
              </TabPanel>
            </Box>
          </Box>
        </Card>
      )}
    </>
  );
};
export default ChatPanel;
