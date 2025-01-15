import { pgTable, serial, text, uniqueIndex, timestamp, jsonb, integer, boolean, uuid } from 'drizzle-orm/pg-core';

import { Node, Edge } from "@xyflow/react";

export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    password: text('password'),
    oauthProvider: text("oauth_provider"),
    oauthProviderId: text("oauth_provider_id"),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (users) => ({
    emailIndex: uniqueIndex('email_idx').on(users.email),
}));

export const workflows = pgTable('workflows', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    nodes: jsonb('nodes').$type<Node[]>(),
    edges: jsonb('edges').$type<Edge[]>().notNull(),
    yamlContent: text('yaml_content'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: text('user_id').notNull(),
});

export const actionTemplates = pgTable('action_templates', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    description: text('description'),
    inputs: jsonb('inputs').$type<Record<string, unknown>>(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const ActionList = pgTable('actions', {
    uuid: uuid().defaultRandom().primaryKey(),
    id: serial('id').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    slug: text('slug').notNull(),
    ownerLogin: text('owner_login').notNull(),
    type: text('type').notNull(),
    color: text('color'),
    iconSvg: text('icon_svg'),
    stars: integer('stars').default(0),
    isVerifiedOwner: boolean('is_verified_owner').default(false),
    categories: jsonb('categories').$type<string[]>(),
    externalUsesPathPrefix: text('external_uses_path_prefix'),
    globalRelayId: text('global_relay_id'),
    createdAt: timestamp('created_at').defaultNow(),
});