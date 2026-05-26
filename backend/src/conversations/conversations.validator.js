const CONDITIONS = ['treatment', 'baseline'];
const PHASES = ['confirming', 'contradicting'];

function validateCreateConversation(body) {
  const errors = [];

  if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
    errors.push('title is required and must be a non-empty string');
  }
  if (!body.condition || !CONDITIONS.includes(body.condition)) {
    errors.push(`condition is required and must be one of: ${CONDITIONS.join(', ')}`);
  }
  if (!body.phase || !PHASES.includes(body.phase)) {
    errors.push(`phase is required and must be one of: ${PHASES.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

function validateCreateConversationMiddleware(req, res, next) {
  const { valid, errors } = validateCreateConversation(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}

module.exports = { validateCreateConversationMiddleware };
