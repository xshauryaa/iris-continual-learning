const { Router } = require('express');
const { validateCreateMessageMiddleware } = require('./messages.validator');
const ctrl = require('./messages.controller');

const router = Router();

router.get('/:id/messages',  ctrl.getMessages);
router.post('/:id/messages', validateCreateMessageMiddleware, ctrl.createMessage);

module.exports = router;
