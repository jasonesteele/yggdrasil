import { gql, useMutation } from "@apollo/client";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { throttle } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { MAX_MESSAGE_LENGTH } from "src/util/constants";
import theme from "../theme";

const POST_MESSAGE = gql`
  mutation PostMessage($text: String!) {
    postMessage(text: $text) {
      id
      createdAt
      text
      user {
        id
      }
    }
  }
`;

const NOTIFY_ACTIVITY = gql`
  mutation NotifyActivity($active: Boolean!) {
    notifyActivity(active: $active) {
      success
    }
  }
`;

const formatError = ({
  graphQLErrors,
  networkError,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  graphQLErrors: any[];
  networkError: string;
}): string[] => {
  return [
    ...graphQLErrors?.map(({ message }) => message),
    ...(networkError ? [networkError] : []),
  ];
};

const ChatCommandField = () => {
  const [command, setCommand] = useState<string>("");
  const [postMessage, { loading: postLoading }] = useMutation(POST_MESSAGE);
  const [postErrors, setPostErrors] = useState<string[]>([]);
  const [notifyActivity] = useMutation(NOTIFY_ACTIVITY);

  const notifyActivityHandler = useMemo(
    () => throttle(() => notifyActivity({ variables: { active: true } }), 2000),
    [notifyActivity]
  );
  useEffect(() => {
    return () => {
      notifyActivityHandler.cancel();
    };
  }, [notifyActivityHandler]);

  const handleSendCommand = async () => {
    if (command.trim().length > 0) {
      try {
        await postMessage({
          variables: {
            text: command.trim(),
          },
        });
        setPostErrors([]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setPostErrors(formatError(error));
      }
    }
    notifyActivityHandler.cancel();
    notifyActivity({ variables: { active: false } });
    setCommand("");
  };

  return (
    <Box sx={{ p: "0.5em" }}>
      <div style={{ position: "relative" }}>
        <TextField
          fullWidth
          value={command}
          placeholder="Type message or / command"
          variant="outlined"
          size="small"
          name="chat"
          data-cy="chat-command-input"
          inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendCommand();
            } else {
              notifyActivityHandler();
            }
          }}
        />
        {postLoading && (
          <CircularProgress
            size="1.5em"
            sx={{ position: "absolute", right: 8, top: 8 }}
          />
        )}
      </div>
      {postErrors?.length > 0 && (
        <Box p={0.5}>
          <List>
            {postErrors.map((postError, idx) => (
              <ListItem key={`postError-${idx}`}>
                <Typography sx={{ color: theme.palette.error.main }}>
                  {postError}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};
export default ChatCommandField;
