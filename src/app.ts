import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import setupGraphQL from "./setup/graphql";
import setupPassport from "./setup/passport";
import { sessionMiddleware } from "./setup/session";
import logger, { accessLogger } from "./util/logger";
import "./setup/env";

const EXPRESS_PORT = Number(process.env.API_PORT) || 3010;

const main = async () => {
  const app = express();

  app.use(accessLogger);
  app.use(cors({ origin: process.env.BASE_URL }));
  app.use(bodyParser.json());
  app.use(sessionMiddleware);

  setupPassport(app);
  await setupGraphQL(app);

  app.listen(EXPRESS_PORT, () => {
    logger.info(`express listening on port ${EXPRESS_PORT}`);
  });
};

main();
