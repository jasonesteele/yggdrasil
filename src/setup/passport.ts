import { Express } from "express-serve-static-core";
import moment from "moment";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { prisma } from "../context/prisma";
import logger from "../util/logger";

const createOrUpdateAccount = async (profile: any) => {
  logger.info({ profile });
  let account = await prisma.account.findUnique({
    where: { id: profile.id },
  });
  if (account) {
    account = await prisma.account.update({
      where: { id: profile.id },
      data: {
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        email: profile.email,
        emailVerified: profile.verified,
        updatedAt: moment().toDate(),
      },
    });
  } else {
    account = await prisma.account.create({
      data: {
        id: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        email: profile.email,
        emailVerified: profile.verified,
      },
    });
  }
  return account;
};

const createOrUpdateUser = async (profile: any) => {
  const account = await createOrUpdateAccount(profile);
  let user = await prisma.user.findUnique({ where: { accountId: profile.id } });
  if (user) {
    user = await prisma.user.update({
      where: {
        accountId: account.id,
      },
      data: {
        name: `${profile.username}#${profile.discriminator}`,
        image: profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : undefined,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        name: `${profile.username}#${profile.discriminator}`,
        image: profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : undefined,
        account: { connect: { id: account.id } },
      },
    });
  }
  return user;
};

const setupAuthentication = (app: Express) => {
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_ID || "discord-id",
        clientSecret: process.env.DISCORD_SECRET || "discord-secret",
        callbackURL: `${process.env.BASE_URL}/auth/discord/callback`,
        scope: ["identify", "email"],
      },
      async (_accessToken, _refreshToken, profile, cb) => {
        const user = await createOrUpdateUser(profile);

        return cb(undefined, user as Express.User);
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

  // TODO: fix redirects
  app.get(
    "/auth/discord/callback",
    passport.authenticate("discord", {
      failureRedirect: "/error",
    }),
    function (_req, res) {
      res.redirect("/secretstuff"); // Successful auth
    }
  );
};

const setupPassport = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());

  setupAuthentication(app);
};
export default setupPassport;
