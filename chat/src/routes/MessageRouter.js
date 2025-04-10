const express = require('express');
const { getKeycloak } = require('@config/keycloak');
const MessageController = require('@controllers/MessageController');

const router = express.Router();

router.post(
  '/messages',
  getKeycloak().protect(),
  MessageController.createMessage
);

module.exports = router;
