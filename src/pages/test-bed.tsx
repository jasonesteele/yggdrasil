import { Box } from "@mui/material";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import ChatPanel from "src/components/chat/ChatPanel";

const Test: NextPage = () => {
  const { status } = useSession({ required: true });

  if (status === "loading") return null;

  return (
    <Box height="100vh" p="0" m="0" sx={{ border: "1px solid red" }}>
      <ChatPanel />
    </Box>
  );
};
export default Test;
