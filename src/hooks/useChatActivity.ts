import { gql, useQuery } from "@apollo/client";
import { Message, User } from "@prisma/client";
import { useEffect, useState } from "react";

const GET_MESSAGES = gql`
  query Messages($channel: String, $sinceSequence: String) {
    messages(channel: $channel, sinceSequence: $sinceSequence) {
      id
      sequence
      createdAt
      text
      user {
        id
        name
        image
      }
      channel {
        id
      }
    }
    userActivity(channel: $channel) {
      id
      name
      image
      lastActivity
    }
  }
`;

const useChatMessages = ({
  channel,
}: {
  channel: string;
}): {
  messages: Message[];
  userActivity: User[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
} => {
  const [fromSequence, setFromSequence] = useState(BigInt(0));
  const [messages, setMessages] = useState<Message[]>([]);
  const { error, data, startPolling, stopPolling } = useQuery(GET_MESSAGES, {
    variables: { channel, sinceSequence: fromSequence.toString() },
  });

  useEffect(() => {
    startPolling(500);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (data?.messages.length > 0) {
    const newMessages = data.messages.sort(
      (a: Message, b: Message) => b.sequence - a.sequence
    );
    const lastSequence = newMessages[newMessages.length - 1].sequence;
    setMessages([...messages, ...newMessages]);
    setFromSequence(lastSequence + 1);
  }

  return {
    messages,
    userActivity: data?.userActivity || [],
    error,
  };
};
export default useChatMessages;
