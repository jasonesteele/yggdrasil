import { gql, useMutation } from "@apollo/client";
import { Box, CircularProgress, TextField } from "@mui/material";
import { throttle } from "lodash";
import { useMemo, useState } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import theme from "../../theme";
import ApolloErrorAlert from "../ApolloErrorAlert";

const MAX_MESSAGE_LENGTH = 1500;

export const POST_MESSAGE = gql`
  mutation PostMessage($channelId: String!, $text: String!) {
    postMessage(channelId: $channelId, text: $text) {
      id
      createdAt
      text
      user {
        id
      }
    }
  }
`;

const ChatCommandField = ({ channelId }: { channelId: string }) => {
  const [command, setCommand] = useState<string>("");
  const [postMessage, { loading: posting, error }] = useMutation(POST_MESSAGE);
  const { sendEvent } = useWebSocket("chat:activity");

  const notifyActivityHandler = useMemo(
    () =>
      throttle(() => {
        sendEvent({ channelId, active: true });
      }, 3000),
    [channelId, sendEvent]
  );

  const cancelActivity = () => {
    notifyActivityHandler.cancel();
    sendEvent({ channelId, active: false });
  };

  const handleSendCommand = async () => {
    notifyActivityHandler.cancel();
    if (command.trim().length > 0) {
      await postMessage({ variables: { channelId, text: command.trim() } });
      setCommand("");
      cancelActivity();
    }
  };

  return (
    <Box>
      {error && (
        <ApolloErrorAlert title="Error sending message" error={error} />
      )}
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
    </Box>
  );
};
export default ChatCommandField;
