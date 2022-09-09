import { PrismaClient } from "@prisma/client";
import { Server } from "http";
import { NextApiRequest } from "next";
import { getToken, JWT } from "next-auth/jwt";
import { prisma } from "./prisma";
import { io } from "./websocket";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface Context {
  prisma: PrismaClient;
  token: JWT;
  io: Server;
}

export const createContext = async ({ req }: { req: NextApiRequest }) => {
  const token = await getToken({ req, secret: process.env.SESSION_SECRET });

  return {
    prisma,
    token,
    io,
  };
};
