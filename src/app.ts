import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import http from "http";
import schema from "../schema";
import { createContext } from "./context";
import setupEnv from "./env";
import logger, { accessLogger } from "./logger";

setupEnv();

const app = express();
const httpServer = http.createServer(app);

app.use(accessLogger);
app.use(cors({ origin: process.env.BASE_URL }));

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  schema,
  context: createContext,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

server.start().then(() => {
  server.applyMiddleware({
    app,
    path: "/graphql",
  });

  app.listen(process.env.API_PORT, () => {
    logger.info(`Example app listening on port ${process.env.API_PORT}`);
  });
});
