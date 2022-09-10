import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { Server } from "socket.io";
import logger from "./logger";
import { prisma } from "./prisma";
import { io } from "./websocket";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface Context {
  prisma: PrismaClient;
  io: Server;
}

export const createContext = async ({ req }: { req: Request }) => {
  logger.info("creating context", req);
  return {
    prisma,
    io,
  };
};
