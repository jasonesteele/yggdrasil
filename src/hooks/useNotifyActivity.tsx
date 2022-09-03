import { gql, useMutation } from "@apollo/client";
import { useMemo } from "react";
import { NexusGenRootTypes } from "src/nexus-typegen";

const NOTIFY_ACTIVITY = gql`
  mutation NotifyActivity($channelId: String) {
    notifyActivity(channelId: $channelId) {
      success
    }
  }
`;

const useNotifyActivity = (): {
  notifyActivity: (
    channelId: string | null
  ) => Promise<NexusGenRootTypes["OperationResponse"]>;
} => {
  const [_notifyActivity] = useMutation(NOTIFY_ACTIVITY);

  const notifyActivity = useMemo(
    () => (channelId: string | null) => {
      return _notifyActivity({ variables: { channelId } }).catch(() => {
        // Intentionally blank
      }) as Promise<NexusGenRootTypes["OperationResponse"]>;
    },
    [_notifyActivity]
  );

  return {
    notifyActivity,
  };
};
export default useNotifyActivity;
