import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function flushDatabase() {
  await prisma.message.deleteMany();
  await prisma.world.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.user.deleteMany();
  await prisma.session.deleteMany();
}

async function main() {
  console.log("Flushing database...");
  await flushDatabase();

  console.log("Creating seed data...");
  const channels = [
    await prisma.channel.create({
      data: {
        name: "global",
        global: true,
      },
    }),
    await prisma.channel.create({
      data: {
        name: "Fantasy World",
      },
    }),
    await prisma.channel.create({
      data: {
        name: "Sci-Fi World",
      },
    }),
    await prisma.channel.create({
      data: {
        name: "Modern World",
      },
    }),
  ];

  const users = [
    await prisma.user.create({
      data: {
        name: "System",
      },
    }),
  ];

  const worlds = [
    await prisma.world.create({
      data: {
        name: "Fantasy World",
        description:
          "Non consectetur a erat nam at lectus urna duis convallis convallis tellus id interdum velit laoreet id donec ultrices tincidunt arcu non sodales neque sodales ut etiam sit amet nisl.",
        owner: { connect: { id: users[0].id } },
        channel: { connect: { id: channels[1].id } },
      },
    }),
    await prisma.world.create({
      data: {
        name: "Sci-Fi World",
        description:
          "Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim sit.",
        owner: { connect: { id: users[0].id } },
        channel: { connect: { id: channels[2].id } },
      },
    }),
    await prisma.world.create({
      data: {
        name: "Modern World",
        description:
          "Viverra vitae congue eu consequat ac felis.  Donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur.",
        owner: { connect: { id: users[0].id } },
        channel: { connect: { id: channels[3].id } },
      },
    }),
  ];

  console.log("users=", worlds);
  console.log("worlds=", worlds);
  console.log("channels =", channels);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
