const { pgTable, uuid, text, timestamp } = require('drizzle-orm/pg-core');

const conversations = pgTable('conversations', {
  id:         uuid('id').primaryKey().defaultRandom(),
  title:      text('title').notNull(),
  condition:  text('condition').notNull(), // "treatment" | "baseline"
  phase:      text('phase').notNull(),     // "confirming" | "contradicting"
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

const messages = pgTable('messages', {
  id:              uuid('id').primaryKey().defaultRandom(),
  conversation_id: uuid('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  role:            text('role').notNull(), // "user" | "assistant"
  content:         text('content').notNull(),
  created_at:      timestamp('created_at').defaultNow().notNull(),
});

module.exports = { conversations, messages };
