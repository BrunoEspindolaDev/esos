const express = require('express');
const { getKeycloak } = require('@config/keycloak');
const MessageController = require('@controllers/MessageController');

const router = express.Router();

/**
 * @swagger
 * /messages/analyze:
 *   post:
 *     summary: Analyze message content
 *     description: Analyze message content for inappropriate terms and moderate if necessary (requires authentication)
 *     tags: [Moderation]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageAnalysis'
 *           examples:
 *             clean_message:
 *               summary: Clean message example
 *               value:
 *                 content: "Hello, how are you?"
 *                 groupId: "group123"
 *                 userId: "user456"
 *             inappropriate_message:
 *               summary: Inappropriate message example
 *               value:
 *                 content: "This message contains bad words"
 *                 groupId: "group123"
 *                 userId: "user456"
 *     responses:
 *       200:
 *         description: Message analysis completed
 *         content:
 *           application/json:
 *             oneOf:
 *               - $ref: '#/components/schemas/ApprovalResult'
 *               - $ref: '#/components/schemas/ModerationResult'
 *             examples:
 *               approved:
 *                 summary: Message approved
 *                 value:
 *                   error: "Mensagem aprovada"
 *               censored:
 *                 summary: Message censored
 *                 value:
 *                   message: "Mensagem censurada"
 *                   data:
 *                     id: "msg123"
 *                     content: "Original message content"
 *                     invalidTerms: ["term1", "term2"]
 *                     createdAt: "2025-07-05T10:00:00Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/messages/analyze',
  getKeycloak().protect(),
  MessageController.analyzeMessage
);

module.exports = router;
