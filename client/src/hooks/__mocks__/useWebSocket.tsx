import "jest";

const useWebSocket = jest.createMockFromModule("../useWebSocket") as any;

declare global {
  var __onTopic: string;
  var __onEvent: ((event: any) => void) | undefined;
  var __isConnected: boolean | undefined;
}

useWebSocket.default = (topic: string, onEvent?: (event: any) => void) => {
  global.__onTopic = topic;
  global.__onEvent = onEvent;
  return {
    isConnected: global.__isConnected === undefined || global.__isConnected,
    sendEvent: jest.fn(),
  };
};

module.exports = useWebSocket;
