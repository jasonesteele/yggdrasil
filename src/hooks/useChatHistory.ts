import { useState } from "react";
import { fetcher } from "../components/AppFrame";
import useSWR from "swr";
import { IMessage } from "../types";

type IChatHistoryOptions = {
  numMessages?: number;
  refreshInterval?: number;
};

const DEFAULT_OPTIONS: IChatHistoryOptions = {
  numMessages: 100,
  refreshInterval: 500,
};

export default function useChatHistory(options?: IChatHistoryOptions) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...(options || {}) };
  const [messages, setMessages] = useState<IMessage[]>([]);

  const lastMessageSeq = messages[messages.length - 1]?.sequence;

  const { data: newMessages, error } = useSWR(
    `/api/chat/message?numMessages=${mergedOptions.numMessages}${
      lastMessageSeq ? `&from=${lastMessageSeq}` : ""
    }`,
    fetcher,
    {
      refreshInterval: mergedOptions.refreshInterval,
    }
  );
  if (newMessages?.length > 0) {
    setMessages(
      [...messages, ...newMessages].slice(
        -(mergedOptions.numMessages
          ? mergedOptions.numMessages
          : Number.MAX_SAFE_INTEGER)
      )
    );
  }

  return {
    messages,
    error,
  };
}
