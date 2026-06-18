const conversationsRepo = require('../conversations/conversations.repo');
const repo = require('./messages.repo');

const FASTAPI_BASE = () => process.env.FASTAPI_BASE_URL;

async function getMessages(req, res) {
  const conversation = await conversationsRepo.getConversationById(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

  const data = await repo.getMessagesByConversation(req.params.id);
  res.json(data);
}

async function createMessage(req, res) {
  const conversation = await conversationsRepo.getConversationById(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

  const { content } = req.body;

  let fastapiRes;
  try {
    fastapiRes = await fetch(`${FASTAPI_BASE()}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
    });
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach FastAPI server', detail: err.message });
  }

  if (!fastapiRes.ok) {
    const text = await fastapiRes.text().catch(() => '');
    return res.status(502).json({ error: 'FastAPI /chat failed', detail: text });
  }

  const fastapiData = await fastapiRes.json();

  if (typeof fastapiData.response === 'string' && fastapiData.response.startsWith('ERROR:')) {
    return res.status(502).json({ error: fastapiData.response });
  }

  const conversationId = req.params.id;
  await repo.createMessage({ conversationId, role: 'user', content });
  await repo.createMessage({ conversationId, role: 'assistant', content: fastapiData.response });

  res.status(201).json({
    response: fastapiData.response,
    turn_count: fastapiData.turn_count,
  });
}

module.exports = { getMessages, createMessage };
