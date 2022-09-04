import { ApolloError, gql, useMutation } from "@apollo/client";
import { useMemo } from "react";
import { NexusGenRootTypes } from "src/nexus-typegen";

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
    notifyActivity(channelId: null) {
      success
    }
  }
`;

const useSendMessage = (): {
  postMessage: (
    channelId: string,
    text: string
  ) => Promise<NexusGenRootTypes["Message"]>;
  posting: boolean;
  error?: ApolloError;
} => {
  const [_postMessage, { loading: posting, error }] = useMutation(POST_MESSAGE);

  const postMessage = useMemo(
    () => (channelId: string, text: string) => {
      return _postMessage({ variables: { channelId, text } }).catch(() => {
        // Intentionally blank
      }) as Promise<NexusGenRootTypes["Message"]>;
    },
    [_postMessage]
  );

  return {
    postMessage,
    posting,
    error,
  };
};
export default useSendMessage;
