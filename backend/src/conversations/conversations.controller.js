const repo = require('./conversations.repo');

const FASTAPI_BASE = () => process.env.FASTAPI_BASE_URL;

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
  const { belief_id, condition, instance, day } = req.body;

  let fastapiRes;
  try {
    fastapiRes = await fetch(`${FASTAPI_BASE()}/new-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ belief_id, condition, instance, day }),
    });
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach FastAPI server', detail: err.message });
  }

  if (!fastapiRes.ok) {
    const text = await fastapiRes.text().catch(() => '');
    return res.status(502).json({ error: 'FastAPI /new-chat failed', detail: text });
  }

  const fastapiData = await fastapiRes.json();

  const conversation = await repo.createConversation({ belief_id, condition, instance, day });
  res.status(201).json({ ...conversation, status: fastapiData.status });
}

async function deleteConversation(req, res) {
  const deleted = await repo.deleteConversation(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Conversation not found' });
  res.status(204).end();
}

module.exports = { listConversations, getConversation, createConversation, deleteConversation };
