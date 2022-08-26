import { PrismaClient } from "@prisma/client";
import { prisma } from "../../util/prisma";
import { JWT, getToken } from "next-auth/jwt";
import { NextApiRequest } from "next";

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
