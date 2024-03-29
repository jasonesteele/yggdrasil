import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import client from "./apollo-client";
import App from "./App";
import SessionProvider from "./providers/SessionProvider";
import ToastProvider from "./providers/ToastProvider";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastProvider>
            <App />
          </ToastProvider>
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
