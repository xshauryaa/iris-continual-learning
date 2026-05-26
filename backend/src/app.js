const express = require('express');
const cors = require('cors');
const conversationsRouter = require('./conversations/conversations.routes');
const messagesRouter = require('./messages/messages.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/conversations', conversationsRouter);
app.use('/api/conversations', messagesRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

module.exports = app;
