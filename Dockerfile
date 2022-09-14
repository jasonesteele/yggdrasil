FROM node:16.15.1-alpine as express-builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY schema ./schema
COPY prisma ./prisma
COPY src ./src
COPY .env ./
COPY .env.test ./
COPY .eslintignore ./
COPY .eslintrc.json ./
COPY .prettierignore ./
COPY jest.config.js ./
COPY jest.setup.js ./
COPY tsconfig.json ./

RUN npm run nexus:typegen
RUN npx prisma generate

RUN npm run lint
#RUN npm test
RUN npm run build

# RUN npm test
RUN npm run build

FROM node:16.15.1-alpine as deploy

RUN adduser -D -u 10001 yggdrasil
USER yggdrasil

WORKDIR /app

COPY --from=express-builder /app/node_modules ./node_modules
COPY --from=express-builder /app/schema ./schema
COPY --from=express-builder /app/dist ./

ENV NODE_ENV=production

ENV SESSION_SECRET=secret
ENV DATABASE_URL=
ENV APP_URL=
ENV DISCORD_ID=
ENV DISCORD_SECRET=

EXPOSE 3010
EXPOSE 4000

ENTRYPOINT [ "node", "src/app.js" ]
