const repo = require('./conversations.repo');

async function listConversations(_req, res) {
  const data = await repo.listConversations();
  res.json(data);
}

async function getConversation(req, res) {
  const conversation = await repo.getConversationById(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conversation);
}

async function createConversation(req, res) {
  const { title, condition, phase } = req.body;
  const conversation = await repo.createConversation({ title, condition, phase });
  res.status(201).json(conversation);
}

async function deleteConversation(req, res) {
  const deleted = await repo.deleteConversation(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Conversation not found' });
  res.status(204).end();
}

module.exports = { listConversations, getConversation, createConversation, deleteConversation };
