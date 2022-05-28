import { fetcher } from "../components/AppFrame";
import useSWR from "swr";
import { append } from "../features/messages/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";

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
  const dispatch = useDispatch();
  const latestSequence = useSelector(
    (state: RootState) => state.messages.latestSequence
  );

  const maxNumMessages = mergedOptions.numMessages as number;
  const { data: newMessages, error } = useSWR(
    `/api/chat/message?numMessages=${maxNumMessages}${
      latestSequence ? `&from=${latestSequence}` : ""
    }`,
    fetcher,
    {
      refreshInterval: mergedOptions.refreshInterval,
    }
  );
  dispatch(
    append({
      messages: newMessages || [],
      maxNumMessages,
      error,
    })
  );
}
