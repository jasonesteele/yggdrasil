import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function flushDatabase() {
  await prisma.message.deleteMany();
  await prisma.world.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log("Flushing database...");
  await flushDatabase();

  console.log("Creating seed data...");

  const globalChannel = await prisma.channel.create({
    data: {
      name: "global",
      global: true,
    },
  });

  console.log("channels =", [globalChannel]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
