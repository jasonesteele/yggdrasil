type User = {
  id: string;
  name: string;
  image?: string;
  online: boolean;
};

type Session = {
  user?: User;
  error?: ApolloError;
};

type Channel = {
  id: string;
  name: string;
};

type Message = {
  text: string;
  createdAt: date;
  user: User;
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
