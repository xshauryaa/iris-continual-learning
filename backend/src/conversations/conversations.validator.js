const CONDITIONS = ['confirming', 'contradicting'];
const INSTANCES = ['treatment', 'baseline'];

function validateCreateConversation(body) {
  const errors = [];

  if (!body.belief_id || typeof body.belief_id !== 'string' || !body.belief_id.trim()) {
    errors.push('belief_id is required and must be a non-empty string');
  }
  if (!body.condition || !CONDITIONS.includes(body.condition)) {
    errors.push(`condition is required and must be one of: ${CONDITIONS.join(', ')}`);
  }
  if (!body.instance || !INSTANCES.includes(body.instance)) {
    errors.push(`instance is required and must be one of: ${INSTANCES.join(', ')}`);
  }
  if (!Number.isInteger(body.day) || body.day < 1) {
    errors.push('day is required and must be a positive integer');
  }

  return { valid: errors.length === 0, errors };
}

function validateCreateConversationMiddleware(req, res, next) {
  const { valid, errors } = validateCreateConversation(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}

module.exports = { validateCreateConversationMiddleware };
