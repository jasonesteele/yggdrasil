import { createServer } from "@graphql-yoga/node";
import { NextApiRequest, NextApiResponse, PageConfig } from "next";
import schema from "../../schema";
import { createContext } from "../../util/context";

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default createServer<{ req: NextApiRequest; res: NextApiResponse }>({
  schema,
  context: createContext,
});
