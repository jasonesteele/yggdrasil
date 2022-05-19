import { createTheme } from "@mui/material";

type FontOptions = {
  color?: string;
  fontStyle?: string;
  fontWeight?: string;
};

type ChatThemeOptions = {
  timestamp?: FontOptions;
  username?: FontOptions;
  message?: FontOptions;
};

declare module "@mui/material/styles" {
  interface Theme {
    chat: ChatThemeOptions;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    chat?: ChatThemeOptions;
  }
}

const theme = createTheme({
  chat: {
    timestamp: {
      color: "#6666ff",
      fontStyle: "italic",
    },
    username: {
      color: "#660066",
      fontWeight: "bold",
    },
    message: {
      color: "#000000",
    },
  },
});

export default theme;
