import dotenv from "dotenv";
import logger from "../util/logger";

const REQUIRED_PROPERTIES = [
  "DATABASE_URL",
  "DISCORD_ID",
  "DISCORD_SECRET",
  "SESSION_SECRET",
  "APP_URL",
];

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" });
  dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
  dotenv.config({ path: ".env.local" });
}

let missingVariabes = false;
REQUIRED_PROPERTIES.forEach((variable) => {
  if (!process.env[variable] || !process.env[variable]?.trim()?.length) {
    missingVariabes = true;
    logger.error(`Error: ${variable} not defined`);
  }
});
if (missingVariabes) process.exit(-1);
