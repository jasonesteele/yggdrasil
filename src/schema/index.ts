import { makeSchema, asNexusMethod, fieldAuthorizePlugin } from 'nexus'
import * as UserTypes from './UserTypes'
import * as MessageTypes from './MessageTypes'
import path from 'path'
import { GraphQLDateTime } from 'graphql-scalars';

export const GQLDateTime = asNexusMethod(GraphQLDateTime, 'dateTime')

const schema = makeSchema({
    types: [MessageTypes, UserTypes, GQLDateTime],
    plugins: [
        fieldAuthorizePlugin()
    ],
    outputs: {
        typegen: path.join(process.cwd(), 'src/nexus-typegen.ts'),
        schema: path.join(process.cwd(), 'generated/schema.graphql')
    },
    contextType: {
        module: path.join(process.cwd(), "src/pages/api/context.ts"),
        export: "Context"
    }
})

export default schema
