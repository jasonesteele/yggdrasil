import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  let prisma: PrismaClient | undefined;
}

export const prisma =
  // @ts-ignore
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

// @ts-ignore
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
