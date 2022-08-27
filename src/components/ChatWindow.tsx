import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MAX_MESSAGE_LENGTH } from "src/util/constants";
import { IMessage } from "src/types";
import theme from "../theme";
import { Wifi, WifiOff } from "@mui/icons-material";

const GET_MESSAGES = gql`
  query Messages {
    messages {
      id
      createdAt
      text
      user {
        id
        name
        image
      }
    }
  }
`;

const GET_USER_ACTIVITY = gql`
  query UserActivity($since: DateTime) {
    userActivity(since: $since) {
      id
      name
      image
      lastActivity
    }
  }
`;

const POST_MESSAGE = gql`
  mutation Mutation($text: String!) {
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

const ChatMessage = ({ message }: { message: IMessage }) => {
  return (
    <Box sx={{ pr: 1, wordBreak: "break-all" }}>
      <Typography sx={{ mr: 1, ...theme.chat.timestamp }} component="span">
        [
        {new Date(message.createdAt).toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
        ]
      </Typography>
      <Typography sx={{ mr: 1, ...theme.chat.username }} component="span">
        {message.user.name}
      </Typography>
      <Typography sx={{ ...theme.chat.message }} component="span">
        {message.text}
      </Typography>
    </Box>
  );
};

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

const ChatWindow = () => {
  const { loading, error, data, startPolling, stopPolling } =
    useQuery(GET_MESSAGES);
  const {
    data: userActivity,
    startPolling: startActivityPolling,
    stopPolling: stopActivityPolling,
  } = useQuery(GET_USER_ACTIVITY);
  const [postMessage, { loading: postLoading }] = useMutation(POST_MESSAGE);
  const [postErrors, setPostErrors] = useState<string[]>([]);
  const [command, setCommand] = useState<string>("");
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startPolling(1000);
    startActivityPolling(1000);
    return () => {
      stopPolling();
      stopActivityPolling();
    };
  }, [startActivityPolling, startPolling, stopActivityPolling, stopPolling]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;

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
    setCommand("");
  };

  return (
    <Paper variant="elevation">
      <Box p={1}>
        <div style={{ position: "relative" }}>
          <Typography variant="subtitle2">Chat</Typography>
          {error ? (
            <WifiOff
              sx={{
                color: theme.palette.error.main,
                position: "absolute",
                right: 8,
                top: 0,
              }}
            />
          ) : (
            <Wifi sx={{ position: "absolute", right: 8, top: 0 }} />
          )}
        </div>
      </Box>
      <Divider />
      <Box sx={{ height: "300px", overflow: "auto" }}>
        <List data-cy="chat-messages">
          {data?.messages?.map((message: IMessage, idx: number) => (
            <ListItem key={`message-${idx}`} sx={{ p: 0, pl: 1 }}>
              <ChatMessage message={message} />
            </ListItem>
          ))}
          <div ref={lastMessageRef} />
        </List>
      </Box>
      <Divider />
      <Box p={0.5}>
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
      </Box>
      {postErrors && (
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
      {JSON.stringify(userActivity)}
    </Paper>
  );
};
export default ChatWindow;
