import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { sessionMiddleware } from "../setup/session";
import logger from "../util/logger";

const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT) || 4000;

declare global {
  // eslint-disable-next-line no-var
  var io: Server;
  // eslint-disable-next-line no-var
  var connectedUsers: Record<string, string[]>;
}

export const connectedUsers = global.connectedUsers
  ? global.connectedUsers
  : (global.connectedUsers = {});

// TODO: handle session timeout for an active websock

const createWebSocket = () => {
  logger.info(`creating websocket server on port ${WEBSOCKET_PORT}`);

  const io = new Server(WEBSOCKET_PORT, {
    cors: {
      origin: process.env.APP_URL,
    },
  });

  io.use((socket, next) => {
    sessionMiddleware(
      socket.request as Request,
      {} as Response,
      next as NextFunction
    );
  }).on("connection", async (socket) => {
    const getUser = async (userId: string) => {
      const user =
        userId &&
        (await prisma.user.findUnique({
          where: { id: socket.request.session.passport?.user?.id },
        }));
      return user;
    };

    const user =
      socket.request.session.passport?.user?.id &&
      (await getUser(socket.request.session.passport?.user?.id));

    if (!user) {
      socket.disconnect();
    } else {
      logger.info({
        msg: `new connection on socket id ${socket.id}`,
        user: {
          id: user.id,
          name: user.name,
        },
      });

      if (connectedUsers[user.id]?.length > 0) {
        connectedUsers[user.id] = [...connectedUsers[user.id], socket.id];
      } else {
        connectedUsers[user.id] = [socket.id];
        logger.info({ msg: "user is online", user });
        io.emit("user:online", {
          user: { id: user.id, name: user.name, image: user.image },
          online: true,
        });
      }

      socket.on("disconnect", async (reason) => {
        logger.info(`disconnect socket id ${socket.id}: ${reason}`);
        connectedUsers[user.id] = connectedUsers[user.id].filter(
          (id) => id !== socket.id
        );
        if (connectedUsers[user.id].length < 1) {
          const eventUser = await getUser(user.id);
          if (eventUser) {
            logger.info({ msg: "user is offline", eventUser });
            io.emit("user:online", {
              user: {
                id: eventUser.id,
                name: eventUser.name,
                image: eventUser.image,
              },
              online: false,
            });
          }
        }
      });
      socket.on("disconnecting", (reason) => {
        logger.info(`disconnecting socket id ${socket.id}: ${reason}`);
      });

      socket.on("chat:activity", async (event) => {
        const eventUser = await getUser(user.id);
        if (eventUser) {
          // TODO: validate that user is a member of the channel?
          io.emit("chat:activity", {
            ...event,
            user: { id: eventUser.id, name: eventUser.name },
            timestamp: new Date(),
          });
        }
      });
    }
  });
  return io;
};

export const io = global.io || createWebSocket();

if (process.env.NODE_ENV !== "production") global.io = io;
