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

  // const cypressUser = await prisma.user.create({
  //   data: {
  //     name: "Cypress",
  //     image:
  //       "https://cdn.discordapp.com/attachments/1014904252772130879/1015364841952776253/unknown.png",
  //   },
  // });

  // const shazaUser = await prisma.user.create({
  //   data: {
  //     name: "Shaza",
  //     image:
  //       "https://cdn.discordapp.com/avatars/71750301031337984/26265cd4d7049a74da9517d6b28801d1.png",
  //   },
  // });

  // const globalChannel = await prisma.channel.create({
  //   data: {
  //     name: "global",
  //     global: true,
  //     users: { connect: [{ id: shazaUser.id }, { id: cypressUser.id }] },
  //   },
  // });

  // const message1 = await prisma.message.create({
  //   data: {
  //     sequence: BigInt(0),
  //     createdAt: moment().subtract(5, "minutes").toDate(),
  //     text: "This is a test message",
  //     user: { connect: { id: cypressUser.id } },
  //     channel: { connect: { id: globalChannel.id } },
  //   },
  // });
  // const message2 = await prisma.message.create({
  //   data: {
  //     sequence: BigInt(1),
  //     createdAt: moment().toDate(),
  //     text: "Is it really?",
  //     user: { connect: { id: shazaUser.id } },
  //     channel: { connect: { id: globalChannel.id } },
  //   },
  // });

  // const world1Channel = await prisma.channel.create({
  //   data: { name: "Realms of the Lost" },
  // });

  // const world2Channel = await prisma.channel.create({
  //   data: { name: "Soulbound" },
  // });

  // const world3Channel = await prisma.channel.create({
  //   data: { name: "Realms of Tyranny" },
  // });

  // const world1 = await prisma.world.create({
  //   data: {
  //     name: "Realms of the Lost",
  //     description:
  //       "Molestie at elementum eu facilisis sed odio morbi quis commodo odio aenean sed adipiscing diam donec adipiscing tristique risus nec.",
  //     owner: { connect: { id: cypressUser.id } },
  //     channel: {
  //       connect: { id: world1Channel.id },
  //     },
  //   },
  // });

  // const world2 = await prisma.world.create({
  //   data: {
  //     name: "Soulbound",
  //     description:
  //       "Molestie at elementum eu facilisis sed odio morbi quis commodo odio aenean.",
  //     owner: { connect: { id: cypressUser.id } },
  //     channel: {
  //       connect: { id: world2Channel.id },
  //     },
  //   },
  // });

  // const world3 = await prisma.world.create({
  //   data: {
  //     name: "Realms of Tyranny",
  //     description:
  //       "Molestie at elementum eu facilisis sed odio morbi quis commodo.",
  //     owner: { connect: { id: cypressUser.id } },
  //     channel: {
  //       connect: { id: world3Channel.id },
  //     },
  //   },
  // });

  // // console.log("users =", [cypressUser, shazaUser]);
  // console.log("channels =", [
  //   globalChannel,
  //   world1Channel,
  //   world2Channel,
  //   world3Channel,
  // ]);
  // console.log("worlds =", [world1, world2, world3]);
  // console.log("messages =", [message1, message2]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
