import { NextApiRequest, NextApiResponse } from "next";
import { accessLogger } from "../../../../util/logger";
import { prisma } from "../../../../util/prisma";

const MAX_STORED_MESSAGES = 1000;

const apiKey = process.env.MAINTBOT_API_KEY;

const purgeMessages = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!apiKey || req.headers.authorization !== `Bearer ${apiKey}`) {
    res.status(401).json({ statusCode: 401, message: "Not authorized" });
  } else {
    await prisma.$queryRaw`
      delete
      from "Message"
      where sequence <= (select max(sequence) from "Message") - ${MAX_STORED_MESSAGES};
    `;
    res.status(200).json({});
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    await purgeMessages(req, res);
  } else {
    res
      .status(405)
      .json({ statusCode: 405, message: `HTTP ${req.method} not allowed` });
  }
  accessLogger(req, res);
};
