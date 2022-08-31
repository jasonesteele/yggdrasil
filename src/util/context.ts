import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { getToken, JWT } from "next-auth/jwt";
import { prisma } from "./prisma";

export interface Context {
  prisma: PrismaClient;
  token: JWT;
}

export const createContext = async ({ req }: { req: NextApiRequest }) => {
  const token = await getToken({ req, secret: process.env.SESSION_SECRET });

  return {
    prisma,
    token,
  };
};
