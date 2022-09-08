import { createPubSub } from "@graphql-yoga/node";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { getToken, JWT } from "next-auth/jwt";
import { NexusGenRootTypes } from "src/nexus-typegen";
import { prisma } from "./prisma";

const pubSub = createPubSub<{
  "message:channelMessages": [message: NexusGenRootTypes["Message"]];
  "message:userActivity": [message: NexusGenRootTypes["UserActivity"]];
}>();

export interface Context {
  prisma: PrismaClient;
  token: JWT;
  pubSub: typeof pubSub;
}

export const createContext = async ({ req }: { req: NextApiRequest }) => {
  const token = await getToken({ req, secret: process.env.SESSION_SECRET });

  return {
    prisma,
    token,
    pubSub,
  };
};
