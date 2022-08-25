import Cors from "micro-cors";
import { ApolloServer } from "apollo-server-micro";
import { PageConfig } from "next";
import schema from "../../schema";
import { createContext } from "./context";

const cors = Cors({
  origin: "http://localhost:3000",
  allowCredentials: true,
});

const server = new ApolloServer({
  schema,
  context: createContext,
});
const startServer = server.start();

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
});
