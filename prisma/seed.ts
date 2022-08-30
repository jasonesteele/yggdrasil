import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function flushDatabase() {
  await prisma.account.deleteMany();
  await prisma.message.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken.deleteMany();
}

async function main() {
  console.log("Flushing database...");
  await flushDatabase();

  console.log("Creating seed data...");

  const users = await prisma.user.upsert({
    where: { email: "cypress@example.com" },
    update: {},
    create: {
      id: "cypressuser",
      email: "cypress@example.com",
      name: "cypress",
      image:
        "https://cdn.discordapp.com/attachments/979367973175316490/979436920490844180/unknown.png",
    },
  });

  const channels = await prisma.channel.create({
    data: { name: "global" },
  });

  console.log("users =", [users]);
  console.log("channels =", [channels]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
