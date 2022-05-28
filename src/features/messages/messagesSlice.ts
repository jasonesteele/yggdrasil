import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IApiError, IMessage } from "../../types";

export interface MessagesState {
  messages: IMessage[];
  latestSequence: number;
  error?: IApiError;
}

const initialState: MessagesState = {
  messages: [],
  latestSequence: -1,
};

export interface AppendActionPayload {
  messages?: [];
  maxNumMessages: number;
  error?: IApiError;
}

const appendMessages = (
  original: IMessage[],
  append: IMessage[],
  maxMessages: number
): { messages: IMessage[]; latestSequence: number } => {
  const messages = [...original, ...append].slice(-maxMessages);

  return {
    messages,
    latestSequence:
      messages.length > 0 ? messages[messages.length - 1].sequence : -1,
  };
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    append: (
      state: Draft<MessagesState>,
      action: PayloadAction<AppendActionPayload>
    ) => {
      return {
        ...state,
        ...appendMessages(
          state.messages,
          action.payload.messages || [],
          action.payload.maxNumMessages
        ),
        error: action.payload.error,
      };
    },
    clear: () => {
      return initialState;
    },
  },
});

export const { append, clear } = messagesSlice.actions;

export default messagesSlice.reducer;
