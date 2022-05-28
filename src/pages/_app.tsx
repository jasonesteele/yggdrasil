import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import theme from "../theme";
import { ThemeProvider } from "@mui/material";
import { Provider as StoreProvider } from "react-redux";
import { store } from "../app/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default MyApp;
