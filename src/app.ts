import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import setupEnv from "./setup/env";
import setupGraphQL from "./setup/graphql";
import setupPassport from "./setup/passport";
import { sessionMiddleware } from "./setup/session";
import logger, { accessLogger } from "./util/logger";

setupEnv();

const main = async () => {
  const app = express();

  app.use(accessLogger);
  app.use(cors({ origin: process.env.BASE_URL }));
  app.use(bodyParser.json());
  app.use(sessionMiddleware);

  setupPassport(app);
  await setupGraphQL(app);

  app.get("/", (_req, res) => {
    res.status(200).send("hello world");
  });

  app.listen(process.env.API_PORT, () => {
    logger.info(`GraphQL listening on port ${process.env.API_PORT}`);
  });
};

main();
