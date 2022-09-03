import { CircularProgress, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { throttle } from "lodash";
import { useMemo, useState } from "react";
import useNotifyActivity from "src/hooks/useNotifyActivity";
import useSendMessage from "src/hooks/useSendMessage";
import theme from "src/theme";
import { MAX_MESSAGE_LENGTH } from "src/util/constants";
import ApolloErrorAlert from "../ApolloErrorAlert";

const ChatCommandField = ({ channelId }: { channelId: string }) => {
  const { postMessage, posting, error } = useSendMessage();
  const { notifyActivity } = useNotifyActivity();
  const [command, setCommand] = useState<string>("");

  const notifyActivityHandler = useMemo(
    () => throttle(() => notifyActivity(channelId), 3000),
    [notifyActivity, channelId]
  );

  const cancelActivity = () => {
    notifyActivity(null);
  };

  const handleSendCommand = async () => {
    if (command.trim().length > 0) {
      await postMessage(channelId, command.trim());
      setCommand("");
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
          sx={{ backgroundColor: theme.palette.background.paper }}
          inputProps={{
            "data-testid": "chat-command-input",
            maxLength: MAX_MESSAGE_LENGTH,
          }}
          onChange={(e) => {
            if (e.target.value.length > 0) {
              notifyActivityHandler();
            } else {
              cancelActivity();
            }
            setCommand(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendCommand();
            }
          }}
        />
        {posting && (
          <CircularProgress
            size="1.5em"
            sx={{ position: "absolute", right: 8, top: 8 }}
          />
        )}
      </div>
      {error && (
        <ApolloErrorAlert title="Error sending message" error={error} />
      )}
    </Box>
  );
};
export default ChatCommandField;
