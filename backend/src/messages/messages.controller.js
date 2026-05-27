const conversationsRepo = require('../conversations/conversations.repo');
const repo = require('./messages.repo');

async function getMessages(req, res) {
  const conversation = await conversationsRepo.getConversationById(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

  const data = await repo.getMessagesByConversation(req.params.id);
  res.json(data);
}

async function createMessage(req, res) {
  const conversation = await conversationsRepo.getConversationById(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

  const { role, content } = req.body;
  const message = await repo.createMessage({ conversationId: req.params.id, role, content });
  res.status(201).json(message);
}

module.exports = { getMessages, createMessage };
