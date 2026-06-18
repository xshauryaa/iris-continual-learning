const { pgTable, uuid, text, integer, timestamp } = require('drizzle-orm/pg-core');

const conversations = pgTable('conversations', {
  id:         uuid('id').primaryKey().defaultRandom(),
  belief_id:  text('belief_id').notNull(),
  condition:  text('condition').notNull(),  // "confirming" | "contradicting"
  instance:   text('instance').notNull(),   // "treatment" | "baseline"
  day:        integer('day').notNull(),
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
