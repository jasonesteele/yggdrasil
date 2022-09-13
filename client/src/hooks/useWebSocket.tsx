import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("ws://localhost:3000");

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnectListener = () => {
      setIsConnected(true);
    };
    const onDisconnectListener = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnectListener);
    socket.on("disconnect", onDisconnectListener);

    return () => {
      socket.off("connect", onConnectListener);
      socket.off("disconnect", onDisconnectListener);
    };
  }, []);

  return {
    isConnected,
    socket,
  };
};
export default useWebSocket;
