import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import theme from "src/theme";
import { MAX_MESSAGE_LENGTH } from "src/util/constants";

const ChatCommandField = ({ channelId }: { channelId: string }) => {
  const [command, setCommand] = useState<string>("");

  const handleSendCommand = async () => {
    if (command.trim().length > 0) {
      console.log(`sending ${command} to channel ${channelId}`);
    }
  };

  return (
    <Box>
      <div style={{ position: "relative" }}>
        <TextField
          fullWidth
          value={command}
          placeholder="Type message or /command"
          variant="outlined"
          size="small"
          name="chat"
          data-cy="chat-command-input"
          sx={{ backgroundColor: theme.palette.background.paper }}
          inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
          onChange={(e) => {
            setCommand(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendCommand();
            }
          }}
        />
      </div>
    </Box>
  );
};
export default ChatCommandField;
