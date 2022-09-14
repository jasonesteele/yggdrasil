import mediaQuery from "css-mediaquery";

export function setWindowWidth(width: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.matchMedia = (query: string): any => {
    return {
      matches: mediaQuery.match(query, { width }),
      addListener: () => {
        // Intentionally blank
      },
      removeListener: () => {
        // Intentionally blank
      },
    };
  };
}

export function fail(message: string) {
  throw new Error(message);
}
