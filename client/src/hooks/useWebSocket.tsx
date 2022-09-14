import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io();

export default function useWebSocket<T>(
  topic: string,
  onEvent?: (event: T) => void
) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const sendEvent = (event: T) => {
    if (isConnected) {
      socket.emit(topic, event);
    }
  };

  useEffect(() => {
    const onConnectListener = () => {
      setIsConnected(true);
    };
    const onDisconnectListener = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnectListener);
    socket.on("disconnect", onDisconnectListener);
    if (onEvent) socket.on(topic, onEvent);

    return () => {
      socket.off("connect", onConnectListener);
      socket.off("disconnect", onDisconnectListener);
      if (onEvent) socket.off(topic, onEvent);
    };
  }, [onEvent, topic]);

  return {
    isConnected,
    sendEvent,
  };
}
