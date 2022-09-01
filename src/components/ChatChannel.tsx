// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatChannel = ({ channel }: { channel: any }) => {
  if (!channel) return null;

  return <div>{JSON.stringify(channel)}</div>;
};
export default ChatChannel;
