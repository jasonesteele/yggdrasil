import { gql, useQuery } from "@apollo/client";
import { Alert, Box, LinearProgress, Paper, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import ApolloErrorAlert from "./ApolloErrorAlert";
import ChatChannel from "./ChatChannel";

const GET_GLOBAL_CHANNEL = gql`
  query GetGlobalChannel {
    globalChannel {
      id
      name
      users {
        id
        name
        image
      }
      messages {
        id
        sequence
        createdAt
        text
        user {
          id
          name
          image
        }
      }
    }
  }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 1, height: "100%" }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

const ChatPanel = () => {
  const [value, setValue] = useState(0);
  const { loading, data, error } = useQuery(GET_GLOBAL_CHANNEL);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: "rgba(0,0,0,0.05)",
        height: "100%",
      }}
      elevation={5}
    >
      {loading && (
        <>
          <Alert severity="info">Loading global chat</Alert>;
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
        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          sx={{ height: "100%" }}
        >
          <Tabs value={value} onChange={handleChange} aria-label="chat channel">
            {data?.globalChannel && (
              <Tab label={data?.globalChannel?.name} {...a11yProps(0)}></Tab>
            )}
          </Tabs>
          {data?.globalChannel && (
            <TabPanel value={value} index={0}>
              <ChatChannel channel={data?.globalChannel} />
            </TabPanel>
          )}
        </Box>
      )}
    </Paper>
  );
};
export default ChatPanel;
