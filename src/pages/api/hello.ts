import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { accessLogger } from "../../util/logger";
import { ErrorResponse } from "./types";

const secret = process.env.SESSION_SECRET;

type Data = {
  token: unknown;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) => {
  const token = await getToken({ req, secret });
  if (token) {
    res.status(200).json({ token });
  } else {
    res.status(401).json({ statusCode: 401, message: "Not authorized" });
  }
  accessLogger(req, res);
};
