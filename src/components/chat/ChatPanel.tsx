import { gql, useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Card,
  LinearProgress,
  Tab,
  Tabs,
  useMediaQuery,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import theme from "src/theme";
import ApolloErrorAlert from "../ApolloErrorAlert";
import { a11yProps, TabPanel } from "../TabPanel";
import ChatCommandField from "./ChatCommandField";
import ChatHistory from "./ChatHistory";
import ChatStatusBar from "./ChatStatusBar";
import ChatUsers from "./ChatUsers";

export const GET_GLOBAL_CHANNEL = gql`
  query GetGlobalChannel {
    globalChannel {
      id
      name
    }
  }
`;

const ChatPanel = () => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));
  const [value, setValue] = useState(0);
  const { loading, data, error } = useQuery(GET_GLOBAL_CHANNEL);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  console.log(data);

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
                <Tab label="Global" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <Box minHeight={0} flexGrow={1}>
              <TabPanel value={1} index={1}>
                <Box display="flex" flexDirection="column" height="100%">
                  <Box display="flex" flexGrow={1} minHeight="100px">
                    <Box minHeight={0} flexGrow={1}>
                      <ChatHistory channelId={data?.globalChannel.id} />
                    </Box>
                    <Box
                      sx={{
                        minHeight: 0,
                        pl: 1,
                        width: mdBreakpoint ? "200px" : "48px",
                      }}
                      justifyContent="flex-end"
                    >
                      <ChatUsers channelId={data?.globalChannel.id} />
                    </Box>
                  </Box>
                  <Box m={0} p={0} pt={1}>
                    <ChatCommandField channelId={data?.globalChannel.id} />
                    <ChatStatusBar channelId={data?.globalChannel.id} />
                  </Box>
                </Box>
              </TabPanel>
            </Box>
          </Box>
        </Card>
      )}
    </>
  );
};
export default ChatPanel;
