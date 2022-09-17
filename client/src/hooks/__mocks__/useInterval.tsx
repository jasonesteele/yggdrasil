import "jest";

const useInterval = jest.createMockFromModule("../useInterval") as any;

declare global {
  var __useInterval_callback: () => void;
}

useInterval.default = (callback: () => void, delay: number) => {
  global.__useInterval_callback = callback;
};

module.exports = useInterval;
