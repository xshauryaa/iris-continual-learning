const { Router } = require('express');
const { validateCreateConversationMiddleware } = require('./conversations.validator');
const ctrl = require('./conversations.controller');

const router = Router();

router.get('/',     ctrl.listConversations);
router.post('/',    validateCreateConversationMiddleware, ctrl.createConversation);
router.get('/:id',  ctrl.getConversation);
router.delete('/:id', ctrl.deleteConversation);

module.exports = router;
