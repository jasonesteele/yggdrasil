import { PrismaClient } from "@prisma/client";
import session, { SessionData, Store } from "express-session";
import moment from "moment";

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
    callback: (err: any, session?: SessionData) => void
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
    callback?: ((err?: any) => void) | undefined
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
    callback?: ((err?: any) => void) | undefined
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
  secret: process.env.SESSION_SECRET || "secret",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 },
  store: new SessionStore(prisma),
});
