import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import theme from "../theme";
import { ThemeProvider } from "@mui/material";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
