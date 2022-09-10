import { Server } from "socket.io";
import logger from "./logger";

const createWebSocket = () => {
  logger.info(
    `Creating websocket server on port ${process.env.WEBSOCKET_PORT}`
  );

  const io = new Server(Number(process.env.WEBSOCKET_PORT), {
    cors: {
      origin: process.env.BASE_URL,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`new connection for ${socket.id}`);
    socket.on("disconnect", (reason) => {
      logger.info(`disconnect ${socket.id}: ${reason}`);
    });
    socket.on("disconnecting", (reason) => {
      logger.info(`disconnecting ${socket.id}: ${reason}`);
    });
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
