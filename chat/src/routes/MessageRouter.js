const express = require('express');
const { getKeycloak } = require('@config/keycloak');
const MessageController = require('@controllers/MessageController');

const router = express.Router();

router.post(
  '/messages',
  getKeycloak().protect(),
  MessageController.createMessage
);
router.put(
  '/messages/:id',
  getKeycloak().protect(),
  MessageController.updateMessage
);
router.delete(
  '/messages/:id',
  getKeycloak().protect(),
  MessageController.deleteMessage
);

module.exports = router;
