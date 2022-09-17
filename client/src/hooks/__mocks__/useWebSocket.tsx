import "jest";

const useWebSocket = jest.createMockFromModule("../useWebSocket") as any;

declare global {
  var __useWebSocket_onTopic: string;
  var __useWebSocket_onEvent: ((event: any) => void) | undefined;
  var __useWebSocket_isConnected: boolean | undefined;
  var __useWebSocket_sendEvent: (event: any) => void;
}

useWebSocket.default = (topic: string, onEvent?: (event: any) => void) => {
  global.__useWebSocket_onTopic = topic;
  global.__useWebSocket_onEvent = onEvent;
  return {
    isConnected:
      global.__useWebSocket_isConnected === undefined ||
      global.__useWebSocket_isConnected,
    sendEvent: global.__useWebSocket_sendEvent || jest.fn(),
  };
};

module.exports = useWebSocket;
