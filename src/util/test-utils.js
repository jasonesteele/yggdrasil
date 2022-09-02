import mediaQuery from "css-mediaquery";

export function setWindowWidth(width) {
  window.matchMedia = (query) => {
    return {
      matches: mediaQuery.match(query, { width }),
      addListener: () => {},
      removeListener: () => {},
    };
  };
}
