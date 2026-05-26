const { eq } = require('drizzle-orm');
const db = require('../../db');
const { conversations } = require('../../db/schema');

async function listConversations() {
  return db.select().from(conversations).orderBy(conversations.created_at);
}

async function getConversationById(id) {
  const rows = await db.select().from(conversations).where(eq(conversations.id, id));
  return rows[0] ?? null;
}

async function createConversation({ title, condition, phase }) {
  const rows = await db
    .insert(conversations)
    .values({ title: title.trim(), condition, phase })
    .returning();
  return rows[0];
}

async function deleteConversation(id) {
  const rows = await db
    .delete(conversations)
    .where(eq(conversations.id, id))
    .returning();
  return rows[0] ?? null;
}

module.exports = { listConversations, getConversationById, createConversation, deleteConversation };
