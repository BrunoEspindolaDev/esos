const express = require('express');
const GroupController = require('@controllers/GroupController');

const router = express.Router();

/**
 * @swagger
 * /groups/user:
 *   post:
 *     summary: Add user to group
 *     description: Add a user to a specific group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: User successfully added to group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/groups/user', GroupController.addUser);

module.exports = router;
