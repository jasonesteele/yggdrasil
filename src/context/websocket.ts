import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { sessionMiddleware } from "../setup/session";
import logger from "../util/logger";

declare global {
  // eslint-disable-next-line no-var
  var io: Server;
  // eslint-disable-next-line no-var
  var connectedUsers: Record<string, string[]>;
}

export const connectedUsers = global.connectedUsers
  ? global.connectedUsers
  : (global.connectedUsers = {});

const createWebSocket = () => {
  logger.info(
    `Creating websocket server on port ${process.env.WEBSOCKET_PORT}`
  );

  const io = new Server(Number(process.env.WEBSOCKET_PORT), {
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
  }).on("connection", (socket) => {
    const user = socket.request.session.passport?.user;
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

      socket.on("disconnect", (reason) => {
        logger.info(`disconnect socket id ${socket.id}: ${reason}`);
        connectedUsers[user.id] = connectedUsers[user.id].filter(
          (id) => id !== socket.id
        );
        if (connectedUsers[user.id].length < 1) {
          logger.info({ msg: "user is offline", user });
          io.emit("user:online", {
            user: { id: user.id, name: user.name, image: user.image },
            online: false,
          });
        }
      });
      socket.on("disconnecting", (reason) => {
        logger.info(`disconnecting socket id ${socket.id}: ${reason}`);
      });

      socket.on("chat:activity", (event) => {
        // TODO: validate that user is a member of the channel?
        io.emit("chat:activity", {
          ...event,
          user: { id: user.id, name: user.name },
          timestamp: new Date(),
        });
      });
    }
  });
  return io;
};

export const io = global.io || createWebSocket();

if (process.env.NODE_ENV !== "production") global.io = io;
