import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function flushDatabase() {
  await prisma.account.deleteMany();
  await prisma.message.deleteMany();
  await prisma.session.deleteMany();
  await prisma.world.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log("Flushing database...");
  await flushDatabase();

  console.log("Creating seed data...");

  const cypressUser = await prisma.user.upsert({
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

  const globalChannel = await prisma.channel.create({
    data: { name: "global", global: true },
  });

  const world1Channel = await prisma.channel.create({
    data: { name: "Realms of the Lost" },
  });

  const world2Channel = await prisma.channel.create({
    data: { name: "Soulbound" },
  });

  const world3Channel = await prisma.channel.create({
    data: { name: "Realms of Tyranny" },
  });

  const world1 = await prisma.world.create({
    data: {
      name: "Realms of the Lost",
      description:
        "Molestie at elementum eu facilisis sed odio morbi quis commodo odio aenean sed adipiscing diam donec adipiscing tristique risus nec.",
      owner: { connect: { id: cypressUser.id } },
      channel: {
        connect: { id: world1Channel.id },
      },
    },
  });

  const world2 = await prisma.world.create({
    data: {
      name: "Soulbound",
      description:
        "Molestie at elementum eu facilisis sed odio morbi quis commodo odio aenean.",
      owner: { connect: { id: cypressUser.id } },
      channel: {
        connect: { id: world2Channel.id },
      },
    },
  });

  const world3 = await prisma.world.create({
    data: {
      name: "Realms of Tyranny",
      description:
        "Molestie at elementum eu facilisis sed odio morbi quis commodo.",
      owner: { connect: { id: cypressUser.id } },
      channel: {
        connect: { id: world3Channel.id },
      },
    },
  });

  console.log("users =", [cypressUser]);
  console.log("channels =", [globalChannel]);
  console.log("worlds =", [world1, world2, world3]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
