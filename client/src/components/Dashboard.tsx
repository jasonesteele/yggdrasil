import { Box, Card, Stack } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import ChatPanel from "./chat/ChatPanel";
import WorldBrowser from "./world/WorldBrowser";

const DashBoardWidget = ({
  children,
  sx,
}: {
  children: JSX.Element | string;
  sx: SxProps<Theme>;
}) => {
  return (
    <Box sx={sx}>
      <Card sx={{ height: "100%", p: 1 }}>{children}</Card>
    </Box>
  );
};

const Dashboard = () => {
  return (
    <Stack display="flex" flexDirection="column" spacing={2} height="100%">
      <DashBoardWidget
        sx={{ flexGrow: 0, flexShrink: 1, minHeight: "150px", height: "50%" }}
      >
        <WorldBrowser />
      </DashBoardWidget>
      <DashBoardWidget sx={{ flexGrow: 1, flexShrink: 0, minHeight: "50px" }}>
        <ChatPanel />
      </DashBoardWidget>
    </Stack>
  );
};
export default Dashboard;
