type User = {
  __typename: "User";
  id: string;
  name: string;
  image?: string | null;
  online: boolean;
};

type Channel = {
  __typename: "Channel";
  id: string;
  name: string;
};

type Message = {
  __typename: "Message";
  text: string;
  createdAt: date;
  user: User;
};

type Session = {
  user?: User;
  error?: ApolloError;
};

type ActivityNotification = {
  channelId: string;
  active: boolean;
  user: User;
  timestamp: date;
};

type UserOnlineNotification = {
  user: User;
  online: boolean;
};