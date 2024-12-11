// src/lib/db/schema.ts
import { pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const workflows = pgTable('workflows', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    nodes: jsonb('nodes').$type<FlowNode[]>(),
    edges: jsonb('edges').$type<FlowEdge[]>(),
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