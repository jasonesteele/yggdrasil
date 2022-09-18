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

type World = {
  __typename: "World";
  id: string;
  name: string;
  description: string;
  image?: string;
  owner: User;
};

type Message = {
  __typename: "Message";
  id: string;
  text: string;
  createdAt: date;
  user: User;
};

type Session = {
  user?: User;
  loading?: boolean;
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
