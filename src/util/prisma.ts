import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var,@typescript-eslint/no-explicit-any
  var prisma: any;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV !== "production" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
