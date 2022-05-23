import { User } from "next-auth";

export type IApiError = {
  statusCode: number;
  message: string;
};

export type IMessage = {
  id: string;
  sequence: number;
  user: User;
  createdAt: Date;
  text: string;
};

export type ILatestMessage = {
  sequence: number;
};
