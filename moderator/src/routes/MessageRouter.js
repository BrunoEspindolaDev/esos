const express = require('express');
const { getKeycloak } = require('@config/keycloak');
const MessageController = require('@controllers/MessageController');

const router = express.Router();

router.post(
  '/messages/analyze',
  getKeycloak().protect(),
  MessageController.analyzeMessage
);

module.exports = router;
