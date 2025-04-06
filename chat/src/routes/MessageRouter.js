const express = require('express');
const MessageController = require('@controllers/MessageController');

const router = express.Router();

router.post('/messages', MessageController.createMessage);

module.exports = router;
