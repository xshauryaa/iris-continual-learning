const { eq } = require('drizzle-orm');
const db = require('../../db');
const { messages } = require('../../db/schema');

async function getMessagesByConversation(conversationId) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversation_id, conversationId))
    .orderBy(messages.created_at);
}

async function createMessage({ conversationId, role, content }) {
  const rows = await db
    .insert(messages)
    .values({ conversation_id: conversationId, role, content: content.trim() })
    .returning();
  return rows[0];
}

module.exports = { getMessagesByConversation, createMessage };
