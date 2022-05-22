import { User } from "next-auth";

export type IApiError = {
  statusCode: number;
  message: string;
};

export type IMessage = {
  id: string;
  user: User;
  createdAt: Date;
  text: string;
};
