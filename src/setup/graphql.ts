import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { Express } from "express-serve-static-core";
import http from "http";
import schema from "../../schema";
import { createContext } from "../context";

const setupGraphQL = async (app: Express) => {
  const httpServer = http.createServer(app);

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
  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });
};
export default setupGraphQL;
