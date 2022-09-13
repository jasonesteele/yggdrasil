import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { sessionMiddleware } from "../setup/session";
import logger from "../util/logger";

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
      // logger.info(
      //   `unauthenticated connection denied for socket id ${socket.id}`
      // );
      // socket.disconnect();
    } else {
      logger.info({
        msg: `new connection on socket id ${socket.id}`,
        user: {
          id: user.id,
          name: user.name,
        },
      });
      socket.on("disconnect", (reason) => {
        logger.info(`disconnect socket id ${socket.id}: ${reason}`);
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

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var io: Server;
}

export const io = global.io || createWebSocket();

if (process.env.NODE_ENV !== "production") global.io = io;
