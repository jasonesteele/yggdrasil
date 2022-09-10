const setupEnv = () => {
  dotenv.config({ path: "./.env" });
  dotenv.config({ path: `./.env.${process.env.NODE_ENV || "development"}` });
  dotenv.config({ path: "./.env.local" });

  if (!process.env.API_PORT) {
    logger.error("Error: API_PORT not defined");
    process.exit(-1);
  }
  if (!process.env.DATABASE_URL) {
    logger.error("Error: DATABASE_URL not defined");
    process.exit(-1);
  }
};

export default setupEnv;
