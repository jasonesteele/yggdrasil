import { Express } from "express-serve-static-core";
import moment from "moment";
import passport from "passport";
import { Profile, Strategy as DiscordStrategy } from "passport-discord";
import { prisma } from "../context/prisma";
import logger from "../util/logger";

const createOrUpdateAccount = async (profile: Profile) => {
  return prisma.account.upsert({
    where: { id: profile.id },
    update: {
      username: profile.username,
      discriminator: profile.discriminator,
      avatar: profile.avatar,
      email: profile.email,
      emailVerified: profile.verified,
    },
    create: {
      id: profile.id,
      username: profile.username,
      discriminator: profile.discriminator,
      avatar: profile.avatar,
      email: profile.email,
      emailVerified: profile.verified,
      updatedAt: moment().toDate(),
    },
  });
};

const createOrUpdateUser = async (profile: Profile) => {
  const account = await createOrUpdateAccount(profile);

  const globalChannels = await prisma.channel.findMany({
    where: { global: true },
  });

  return prisma.user.upsert({
    where: { accountId: profile.id },
    update: {
      name: `${profile.username}#${profile.discriminator}`,
      image: profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        : undefined,
      updatedAt: moment().toDate(),
      channels: { connect: globalChannels.map(({ id }) => ({ id })) },
    },
    create: {
      name: `${profile.username}#${profile.discriminator}`,
      image: profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        : undefined,
      account: { connect: { id: account.id } },
      channels: { connect: globalChannels.map(({ id }) => ({ id })) },
    },
  });
};

const setupAuthentication = (app: Express) => {
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_ID || "discord-id",
        clientSecret: process.env.DISCORD_SECRET || "discord-secret",
        callbackURL: `${process.env.APP_URL}/auth/discord/callback`,
        scope: ["identify", "email"],
      },
      async (_accessToken, _refreshToken, profile, cb) => {
        const user = await createOrUpdateUser(profile);

        return cb(undefined, user);
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(undefined, user);
  });
  passport.deserializeUser((obj, done) => {
    done(undefined, obj as Express.User);
  });

  app.get("/auth/discord", passport.authenticate("discord"));

  app.get(
    "/auth/discord/callback",
    passport.authenticate("discord", {
      failureRedirect: "/?error=access_denied",
    }),
    function (req, res) {
      const user = req.session.passport?.user;
      logger.info({
        msg: "Logging in",
        user: { id: user?.id, name: user?.name },
      });
      res.redirect("/"); // Successful auth
    }
  );
  app.post("/auth/logout", (req, res, next) => {
    const user = req.session.passport?.user;
    if (user) {
      logger.info({
        msg: "Logging out",
        user: { id: user?.id, name: user?.name },
      });
      req.logout((err) => {
        if (err) {
          return next(err);
        }
      });
    }
    res.redirect("/");
  });
};

const setupPassport = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());

  setupAuthentication(app);
};
export default setupPassport;
