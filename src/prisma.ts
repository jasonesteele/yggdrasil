import { PrismaClient } from "@prisma/client";
import logger from "./logger";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

const createPrismaClient = () => {
  logger.info("creating prisma client");
  return new PrismaClient({
    log: process.env.DEBUG_SQL ? ["query"] : [],
  });
};

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
