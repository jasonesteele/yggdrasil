import { objectType, extendType, nonNull, stringArg } from 'nexus'
import { User } from './UserTypes';

const MAX_QUERY_MESSAGES = 1000;

export const Message = objectType({
    name: 'Message',
    description: 'A message sent by a user',
    definition(t) {
        t.id('id', { description: 'Unique message identifier' });
        t.dateTime('createdAt', { description: 'Timestamp of message creation' });
        t.string('text', { description: 'Message text' });
        t.field('user', { type: User, description: 'User who created this message ' });
    },
});

export const Query = extendType({
    type: 'Query',
    definition(t) {
        t.list.field('messages', {
            type: 'Message',
            authorize: (_root, _args, ctx) => !!ctx.token,
            description: 'Retrieves all active messages on the server',
            resolve: (_root, _args, ctx) => {
                return ctx.prisma.message.findMany({
                    take: MAX_QUERY_MESSAGES,
                    include: {
                        user: true
                    },
                    orderBy: [
                        {
                            createdAt: 'asc'
                        }
                    ]
                });
            },
        });
    },
});

export const Mutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('postMessage', {
            type: Message,
            args: {
                text: nonNull(stringArg())
            },
            authorize: (_root, _args, ctx) => !!ctx.token,
            resolve(_root, args, ctx) {
                console.log({ctx});
                return ctx.prisma.message.create({
                    data: {
                        text: args.text,
                        userId: ctx.token.sub
                    }
                })
            }
        })
    }
});
