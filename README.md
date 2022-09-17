[![Node.js CI](https://github.com/jasonesteele/yggdrasil/actions/workflows/node.js.yml/badge.svg)](https://github.com/jasonesteele/yggdrasil/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/jasonesteele/yggdrasil/actions/workflows/codeql.yml/badge.svg)](https://github.com/jasonesteele/yggdrasil/actions/workflows/codeql.yml)

# Yggdrasil

Yggdrasil is a platform for text-based roleplaying (RP) in the style of old-school [MUDs or MUSHs](https://en.wikipedia.org/wiki/MU*) with a heavy influence from forum or chat-based RP. Users can create or utilize collaborative settings, define characters and then interact in real time to create stories.

## Official Server

_Coming soon_

## Development

### Pre-requisites

- [Node 16.x](https://nodejs.org) or later
- [Docker](https://www.docker.com/products/docker-desktop/)

### Set up Discord authentication

Create an account on [Discord Developer Portal](https://discord.com/developers)

- Create an application (name doesn't matter)
- Under `OAuth2` add a redirect for http://localhost:3000/auth/discord/callback
- Take note of the `CLIENT ID` and `CLIENT SECRET`

Yggdrasil will request the `identity` and `email` scopes for a user when they log in.

### Running development servers with hot-reload

Run the Express/GraphQL/Websocket backend:

    # Install dependencies
    npm ci

    # Configure Discord Oauth2
    export DISCORD_ID=<CLIENT ID>
    export DISCORD_SECRET=<CLIENT SECRET>

    # Start local Postgres database and configure schema
    docker-compose --profile dev up
    npm run db:migrate:dev

    # Start Express/GraphQL backend
    npm start

Run the React frontend (in a separate shell):

    cd client

    # Install dependencies
    npm ci

    # Start React development server (in a separate shell)
    npm start

Connect to http://localhost:3000 and log in through Discord.

### Running production builds

    docker compose build

    # Configure Discord Oauth2
    export DISCORD_ID=<CLIENT ID>
    export DISCORD_SECRET=<CLIENT SECRET>
    
    docker compose --profile integration up

Connect to http://localhost:3000 and log in through Discord.
