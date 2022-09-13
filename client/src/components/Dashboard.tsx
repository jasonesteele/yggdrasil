import { Box, Card, Stack } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import ChatPanel from "./chat/ChatPanel";

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
      <DashBoardWidget sx={{ flexGrow: 0, height: "50%" }}>
        World list
      </DashBoardWidget>
      <DashBoardWidget sx={{ flexGrow: 1, minHeight: 0 }}>
        <ChatPanel />
      </DashBoardWidget>
    </Stack>
  );
};
export default Dashboard;
