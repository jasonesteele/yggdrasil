import pino from "pino";
import expressPino from "express-pino-logger";

const { LOG_LEVEL, ENABLE_ACCESS_LOG } = process.env;

export const accessLogger = expressPino({
  level: LOG_LEVEL || "info",
  enabled: ENABLE_ACCESS_LOG === "true",
});

export const logger = pino({
  level: LOG_LEVEL || "info",
  browser: { asObject: true },
});

export default logger;
