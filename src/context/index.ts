import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { Server } from "socket.io";
import { NexusGenRootTypes } from "../nexus-typegen";
import { prisma } from "./prisma";
import { io } from "./websocket";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface Context {
  prisma: PrismaClient;
  io: Server;
  user: NexusGenRootTypes["User"];
}

export const createContext = async ({ req }: { req: Request }) => {
  return {
    prisma,
    io,
    user: (req.session as any)?.passport?.user,
  };
};
