/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./context/index"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  BigInt: any
  DateTime: any
}

export interface NexusGenObjects {
  Article: { // root type
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    createdBy?: NexusGenRootTypes['User'] | null; // User
    id?: string | null; // ID
    text?: string | null; // String
    title?: string | null; // String
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    updatedBy?: NexusGenRootTypes['User'] | null; // User
    world?: NexusGenRootTypes['World'] | null; // World
  }
  Channel: { // root type
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    location?: NexusGenRootTypes['Location'] | null; // Location
    messages?: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    name?: string | null; // String
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    users?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    world?: NexusGenRootTypes['World'] | null; // World
  }
  Character: { // root type
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    location?: NexusGenRootTypes['Location'] | null; // Location
    name?: string | null; // String
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    user?: NexusGenRootTypes['User'] | null; // User
    world?: NexusGenRootTypes['World'] | null; // World
  }
  Location: { // root type
    channel?: NexusGenRootTypes['Channel'] | null; // Channel
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    description?: string | null; // ID
    exits?: NexusGenRootTypes['LocationConnection'] | null; // LocationConnection
    id?: string | null; // ID
    name?: string | null; // ID
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    world?: NexusGenRootTypes['World'] | null; // World
  }
  LocationConnection: { // root type
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    description?: string | null; // ID
    name?: string | null; // ID
    sourceLocation?: NexusGenRootTypes['Location'] | null; // Location
    targetLocation?: NexusGenRootTypes['Location'] | null; // Location
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Message: { // root type
    channel?: NexusGenRootTypes['Channel'] | null; // Channel
    channelId?: string | null; // String
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    sequence?: NexusGenScalars['BigInt'] | null; // BigInt
    text?: string | null; // String
    user?: NexusGenRootTypes['User'] | null; // User
  }
  Mutation: {};
  OperationResponse: { // root type
    success?: boolean | null; // Boolean
  }
  Query: {};
  User: { // root type
    channels?: Array<NexusGenRootTypes['Channel'] | null> | null; // [Channel]
    characters?: Array<NexusGenRootTypes['Character'] | null> | null; // [Character]
    createdArticles?: Array<NexusGenRootTypes['Article'] | null> | null; // [Article]
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    image?: string | null; // String
    name?: string | null; // String
    online?: boolean | null; // Boolean
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    worlds?: Array<NexusGenRootTypes['World'] | null> | null; // [World]
  }
  UserActivity: { // root type
    channel?: NexusGenRootTypes['Channel'] | null; // Channel
    timestamp?: NexusGenScalars['DateTime'] | null; // DateTime
    user?: NexusGenRootTypes['User'] | null; // User
  }
  UserMutateResponse: { // root type
    user?: NexusGenRootTypes['User'] | null; // User
    validationErrors?: Array<NexusGenRootTypes['ValidationError'] | null> | null; // [ValidationError]
  }
  ValidationError: { // root type
    field?: string | null; // String
    message?: string | null; // String
  }
  World: { // root type
    articles?: Array<NexusGenRootTypes['Article'] | null> | null; // [Article]
    channel?: NexusGenRootTypes['Channel'] | null; // Channel
    characters?: Array<NexusGenRootTypes['Character'] | null> | null; // [Character]
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    description?: string | null; // String
    id?: string | null; // ID
    image?: string | null; // String
    locations?: Array<NexusGenRootTypes['Location'] | null> | null; // [Location]
    name?: string | null; // String
    owner?: NexusGenRootTypes['User'] | null; // User
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    users?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  WorldMutateResponse: { // root type
    validationErrors?: Array<NexusGenRootTypes['ValidationError'] | null> | null; // [ValidationError]
    world?: NexusGenRootTypes['World'] | null; // World
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Article: { // field return type
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    createdBy: NexusGenRootTypes['User'] | null; // User
    id: string | null; // ID
    text: string | null; // String
    title: string | null; // String
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    updatedBy: NexusGenRootTypes['User'] | null; // User
    world: NexusGenRootTypes['World'] | null; // World
  }
  Channel: { // field return type
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    location: NexusGenRootTypes['Location'] | null; // Location
    messages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    name: string | null; // String
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    users: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    world: NexusGenRootTypes['World'] | null; // World
  }
  Character: { // field return type
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    location: NexusGenRootTypes['Location'] | null; // Location
    name: string | null; // String
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    user: NexusGenRootTypes['User'] | null; // User
    world: NexusGenRootTypes['World'] | null; // World
  }
  Location: { // field return type
    channel: NexusGenRootTypes['Channel'] | null; // Channel
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    description: string | null; // ID
    exits: NexusGenRootTypes['LocationConnection'] | null; // LocationConnection
    id: string | null; // ID
    name: string | null; // ID
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    world: NexusGenRootTypes['World'] | null; // World
  }
  LocationConnection: { // field return type
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    description: string | null; // ID
    name: string | null; // ID
    sourceLocation: NexusGenRootTypes['Location'] | null; // Location
    targetLocation: NexusGenRootTypes['Location'] | null; // Location
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Message: { // field return type
    channel: NexusGenRootTypes['Channel'] | null; // Channel
    channelId: string | null; // String
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    sequence: NexusGenScalars['BigInt'] | null; // BigInt
    text: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
  }
  Mutation: { // field return type
    createWorld: NexusGenRootTypes['WorldMutateResponse'] | null; // WorldMutateResponse
    deleteWorld: NexusGenRootTypes['OperationResponse'] | null; // OperationResponse
    joinWorld: NexusGenRootTypes['OperationResponse'] | null; // OperationResponse
    leaveWorld: NexusGenRootTypes['OperationResponse'] | null; // OperationResponse
    postMessage: NexusGenRootTypes['Message'] | null; // Message
    updateCurrentUser: NexusGenRootTypes['UserMutateResponse'] | null; // UserMutateResponse
  }
  OperationResponse: { // field return type
    success: boolean | null; // Boolean
  }
  Query: { // field return type
    channelMessages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    channelUsers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    currentUser: NexusGenRootTypes['User'] | null; // User
    subscribedChannels: Array<NexusGenRootTypes['Channel'] | null> | null; // [Channel]
    user: NexusGenRootTypes['User'] | null; // User
    users: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    worlds: Array<NexusGenRootTypes['World'] | null> | null; // [World]
  }
  User: { // field return type
    channels: Array<NexusGenRootTypes['Channel'] | null> | null; // [Channel]
    characters: Array<NexusGenRootTypes['Character'] | null> | null; // [Character]
    createdArticles: Array<NexusGenRootTypes['Article'] | null> | null; // [Article]
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    image: string | null; // String
    name: string | null; // String
    online: boolean | null; // Boolean
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    worlds: Array<NexusGenRootTypes['World'] | null> | null; // [World]
  }
  UserActivity: { // field return type
    channel: NexusGenRootTypes['Channel'] | null; // Channel
    timestamp: NexusGenScalars['DateTime'] | null; // DateTime
    user: NexusGenRootTypes['User'] | null; // User
  }
  UserMutateResponse: { // field return type
    user: NexusGenRootTypes['User'] | null; // User
    validationErrors: Array<NexusGenRootTypes['ValidationError'] | null> | null; // [ValidationError]
  }
  ValidationError: { // field return type
    field: string | null; // String
    message: string | null; // String
  }
  World: { // field return type
    articles: Array<NexusGenRootTypes['Article'] | null> | null; // [Article]
    channel: NexusGenRootTypes['Channel'] | null; // Channel
    characters: Array<NexusGenRootTypes['Character'] | null> | null; // [Character]
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    description: string | null; // String
    id: string | null; // ID
    image: string | null; // String
    locations: Array<NexusGenRootTypes['Location'] | null> | null; // [Location]
    name: string | null; // String
    owner: NexusGenRootTypes['User'] | null; // User
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    users: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  WorldMutateResponse: { // field return type
    validationErrors: Array<NexusGenRootTypes['ValidationError'] | null> | null; // [ValidationError]
    world: NexusGenRootTypes['World'] | null; // World
  }
}

export interface NexusGenFieldTypeNames {
  Article: { // field return type name
    createdAt: 'DateTime'
    createdBy: 'User'
    id: 'ID'
    text: 'String'
    title: 'String'
    updatedAt: 'DateTime'
    updatedBy: 'User'
    world: 'World'
  }
  Channel: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    location: 'Location'
    messages: 'Message'
    name: 'String'
    updatedAt: 'DateTime'
    users: 'User'
    world: 'World'
  }
  Character: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    location: 'Location'
    name: 'String'
    updatedAt: 'DateTime'
    user: 'User'
    world: 'World'
  }
  Location: { // field return type name
    channel: 'Channel'
    createdAt: 'DateTime'
    description: 'ID'
    exits: 'LocationConnection'
    id: 'ID'
    name: 'ID'
    updatedAt: 'DateTime'
    world: 'World'
  }
  LocationConnection: { // field return type name
    createdAt: 'DateTime'
    description: 'ID'
    name: 'ID'
    sourceLocation: 'Location'
    targetLocation: 'Location'
    updatedAt: 'DateTime'
  }
  Message: { // field return type name
    channel: 'Channel'
    channelId: 'String'
    createdAt: 'DateTime'
    id: 'ID'
    sequence: 'BigInt'
    text: 'String'
    user: 'User'
  }
  Mutation: { // field return type name
    createWorld: 'WorldMutateResponse'
    deleteWorld: 'OperationResponse'
    joinWorld: 'OperationResponse'
    leaveWorld: 'OperationResponse'
    postMessage: 'Message'
    updateCurrentUser: 'UserMutateResponse'
  }
  OperationResponse: { // field return type name
    success: 'Boolean'
  }
  Query: { // field return type name
    channelMessages: 'Message'
    channelUsers: 'User'
    currentUser: 'User'
    subscribedChannels: 'Channel'
    user: 'User'
    users: 'User'
    worlds: 'World'
  }
  User: { // field return type name
    channels: 'Channel'
    characters: 'Character'
    createdArticles: 'Article'
    createdAt: 'DateTime'
    id: 'ID'
    image: 'String'
    name: 'String'
    online: 'Boolean'
    updatedAt: 'DateTime'
    worlds: 'World'
  }
  UserActivity: { // field return type name
    channel: 'Channel'
    timestamp: 'DateTime'
    user: 'User'
  }
  UserMutateResponse: { // field return type name
    user: 'User'
    validationErrors: 'ValidationError'
  }
  ValidationError: { // field return type name
    field: 'String'
    message: 'String'
  }
  World: { // field return type name
    articles: 'Article'
    channel: 'Channel'
    characters: 'Character'
    createdAt: 'DateTime'
    description: 'String'
    id: 'ID'
    image: 'String'
    locations: 'Location'
    name: 'String'
    owner: 'User'
    updatedAt: 'DateTime'
    users: 'User'
  }
  WorldMutateResponse: { // field return type name
    validationErrors: 'ValidationError'
    world: 'World'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createWorld: { // args
      description?: string | null; // String
      name: string; // String!
    }
    deleteWorld: { // args
      worldId: string; // String!
    }
    joinWorld: { // args
      worldId: string; // String!
    }
    leaveWorld: { // args
      worldId: string; // String!
    }
    postMessage: { // args
      channelId: string; // String!
      text: string; // String!
    }
    updateCurrentUser: { // args
      name: string; // String!
    }
  }
  Query: {
    channelMessages: { // args
      channelId: string; // String!
    }
    channelUsers: { // args
      channelId: string; // String!
    }
    user: { // args
      id: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}