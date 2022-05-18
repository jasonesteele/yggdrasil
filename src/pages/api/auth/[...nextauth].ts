import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
// import CredentialsProvider from "next-auth/providers/credentials";
import logger from "../../../util/logger";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(process.env.DISCORD_ID && process.env.DISCORD_SECRET
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_ID,
            clientSecret: process.env.DISCORD_SECRET,
            authorization: { params: { scope: "identify email" } },
          }),
        ]
      : []),
    // ...(process.env.NODE_ENV !== "production"
    //   ? [
    //       CredentialsProvider({
    //         name: "Credentials",
    //         credentials: {
    //           name: {
    //             label: "Name",
    //             type: "text",
    //           },
    //         },
    //         async authorize(credentials) {
    //           if (credentials?.name) {
    //             return {
    //               name: credentials.name,
    //               image: process.env.DEFAULT_USER_AVATAR,
    //             };
    //           }
    //           return null;
    //         },
    //       }),
    //     ]
    //   : []),
  ],
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60
    // updateAge: 24 * 60 * 60
  },
  jwt: {
    secret: process.env.SESSION_SECRET,
  },
  pages: {
    signIn: "/signin",
    // signOut: '/auth/signout'
    // error: '/auth/error'
    // verifyRequest: '/auth/verify-request'
    // newUser: null
  },
  callbacks: {
    // async signIn({user, account, profile, email, credentials}) { return true },
    // async redirect({url, baseUrl}) { return baseUrl },
    // async session({session, token, user}) { return session },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
  },
  events: {
    signIn: ({ account, isNewUser, profile, user }) => {
      logger.info({
        component: "auth",
        event: "signIn",
        account,
        isNewUser,
        profile,
        user,
      });
    },
    signOut: ({ session, token }) => {
      logger.info({ component: "auth", event: "signOut", session, token });
    },
    createUser: ({ user }) => {
      logger.info({ component: "auth", event: "createUser", user });
    },
    updateUser: ({ user }) => {
      logger.info({ component: "auth", event: "updateUser", user });
    },
    linkAccount: ({ account, user }) => {
      logger.info({ component: "auth", event: "linkAccount", account, user });
    },
    session: ({ session, token }) => {
      logger.trace({ component: "auth", event: "session", session, token });
    },
  },

  debug: false,
});
