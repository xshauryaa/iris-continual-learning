const ROLES = ['user', 'assistant'];

function validateCreateMessage(body) {
  const errors = [];

  if (!body.role || !ROLES.includes(body.role)) {
    errors.push(`role is required and must be one of: ${ROLES.join(', ')}`);
  }
  if (!body.content || typeof body.content !== 'string' || !body.content.trim()) {
    errors.push('content is required and must be a non-empty string');
  }

  return { valid: errors.length === 0, errors };
}

function validateCreateMessageMiddleware(req, res, next) {
  const { valid, errors } = validateCreateMessage(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}

module.exports = { validateCreateMessageMiddleware };
