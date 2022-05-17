import { NextApiRequest, NextApiResponse } from "next";
import pino from "pino";
import httpLoggerFactory from "pino-http";

const LOG_LEVEL = "debug";

const _accessLogger = httpLoggerFactory();

export const accessLogger = (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.ENABLE_ACCESS_LOG) {
    _accessLogger(req, res);
  }
};

export const logger = pino({
  level: LOG_LEVEL,
  browser: { asObject: true },
});

export default logger;
