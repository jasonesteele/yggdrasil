FROM node:16.15.1-alpine as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY prisma ./
COPY schema ./
COPY src ./
COPY .env ./
COPY .eslintignore ./
COPY .eslintrc.json ./
COPY .prettierignore ./
COPY jest.config.js ./
COPY jest.setup.js ./
COPY tsconfig.json ./

RUN npm run prettier:check
RUN npm run lint
RUN npm test
RUN npm build

FROM node:16.15.1-alpine as deploy

WORKDIR /app

COPY --from=builder /app/dist/* ./

RUN node src/app.js
