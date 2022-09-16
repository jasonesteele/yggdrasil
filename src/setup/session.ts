import { PrismaClient, User } from "@prisma/client";
import session, { Session, SessionData, Store } from "express-session";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { prisma } from "../context/prisma";

declare module "http" {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
  }
}

declare module "express-session" {
  interface SessionData {
    passport: {
      user: User;
    };
  }
}

interface SessionOptions {
  ttl: number;
}

const defaultSessionOptions: SessionOptions = {
  ttl: 60 * 60,
};

export class SessionStore extends Store {
  private options: SessionOptions;

  constructor(
    private readonly prisma: PrismaClient,
    readonly _options?: SessionOptions
  ) {
    super();
    this.options = { ...defaultSessionOptions, ...(_options ? _options : {}) };
  }

  async get(
    sid: string,
    callback: (err: unknown, session?: SessionData) => void
  ): Promise<void> {
    try {
      const session = await this.prisma.session.findUnique({ where: { sid } });
      callback(undefined, session?.data ? JSON.parse(session.data) : undefined);
    } catch (error) {
      callback(error);
    }
  }

  async set(
    sid: string,
    sessionData: SessionData,
    callback?: ((err?: unknown) => void) | undefined
  ): Promise<void> {
    try {
      const session = await this.prisma.session.findUnique({ where: { sid } });
      if (session) {
        await this.prisma.session.update({
          where: {
            sid,
          },
          data: {
            ...session,
            data: JSON.stringify(sessionData),
          },
        });
      } else {
        await this.prisma.session.create({
          data: {
            sid,
            data: JSON.stringify(sessionData),
            expiresAt: moment().add(this.options.ttl, "seconds").toDate(),
          },
        });
      }
      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async destroy(
    sid: string,
    callback?: ((err?: unknown) => void) | undefined
  ): Promise<void> {
    try {
      await this.prisma.session.deleteMany({ where: { sid } });
      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }
}

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || uuidv4(),
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 },
  store: new SessionStore(prisma),
});
