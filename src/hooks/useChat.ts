import { useState } from "react";

export default function useChat() {
  const [error, setError] = useState(null);

  const sendCommand = (command: string) => {
    if (command.trim().length > 0) {
      fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: command?.trim() }),
      }).then(
        () => {
          setError(null);
        },
        (error) => {
          setError(error);
        }
      );
    }
  };

  return {
    sendCommand,
    error,
  };
}
