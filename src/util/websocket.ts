import { Server } from "socket.io";

const createWebSocket = () => {
  console.log(
    `Creating websocket server on port ${process.env.WEBSOCKET_PORT}`
  );

  const io = new Server(Number(process.env.WEBSOCKET_PORT), {});

  io.on("connection", (socket) => {
    console.log(`xxx = new connection for ${socket.id}`);
    socket.broadcast.emit("connected", socket.id);
    socket.on("disconnect", (reason) => {
      socket.broadcast.emit("disconnect", socket.id, reason);
      console.log(`xxx = disconnect ${socket.id}: ${reason}`);
    });
    socket.on("disconnecting", (reason) => {
      socket.broadcast.emit("disconnecting", socket.id, reason);
      console.log(`disconnecting ${socket.id}: ${reason}`);
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
