import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";
import { Server } from "socket.io";
import { prisma } from "./prisma";
import { io } from "./websocket";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface Context {
  prisma: PrismaClient;
  io: Server;
  user: User;
}

export const createContext = async ({ req }: { req: Request }) => {
  return {
    prisma,
    io,
    user: req.session?.passport?.user,
  };
};
