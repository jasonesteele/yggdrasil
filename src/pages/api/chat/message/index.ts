import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { accessLogger, logger } from "../../../../util/logger";
import { prisma } from "../../../../util/prisma";

const secret = process.env.SESSION_SECRET;

const MAX_QUERY_MESSAGES = 50;

const getMessages = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req, secret });
  const { from } = req.query;

  if (!token?.sub) {
    res.status(401).json({ statusCode: 401, message: "Not authorized" });
  } else {
    const messages = await prisma.message.findMany({
      take: MAX_QUERY_MESSAGES,
      where: {
        sequence: {
          gt: from ? parseInt(from as string) : 0,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [
        {
          sequence: "asc",
        },
      ],
    });

    res.status(200).json(messages);
  }
};

const postMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req, secret });
  if (!token?.sub) {
    res.status(401).json({ statusCode: 401, message: "Not authorized" });
  } else if (!req.body.text) {
    res.status(400).json({
      statusCode: 400,
      message: "Malformed request - missing message text",
    });
  } else {
    const message = await prisma.message.create({
      data: {
        text: req.body.text,
        userId: token.sub,
      },
    });
    logger.info({ message: "postMessage", newMessage: message });
    res.status(200).json(message);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    await getMessages(req, res);
  } else if (req.method === "POST") {
    await postMessage(req, res);
  } else {
    res
      .status(405)
      .json({ statusCode: 405, message: `HTTP ${req.method} not allowed` });
  }
  accessLogger(req, res);
};
