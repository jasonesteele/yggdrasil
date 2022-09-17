import "jest";

const useWebSocket = jest.createMockFromModule("../useWebSocket") as any;

declare global {
  var __onTopic: string;
  var __onEvent: ((event: any) => void) | undefined;
  var __isConnected: boolean | undefined;
  var __sendEvent: (event: any) => void;
}

useWebSocket.default = (topic: string, onEvent?: (event: any) => void) => {
  global.__onTopic = topic;
  global.__onEvent = onEvent;
  return {
    isConnected: global.__isConnected === undefined || global.__isConnected,
    sendEvent: global.__sendEvent || jest.fn(),
  };
};

module.exports = useWebSocket;
