import "jest";

const useWebSocket = jest.createMockFromModule("../useWebSocket") as any;

declare global {
  var __onTopic: string;
  var __onEvent: ((event: any) => void) | undefined;
}

useWebSocket.default = (topic: string, onEvent?: (event: any) => void) => {
  global.__onTopic = topic;
  global.__onEvent = onEvent;
  return { isConnected: true, sendEvent: jest.fn() };
};

module.exports = useWebSocket;
