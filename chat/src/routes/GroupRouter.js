const express = require('express');
const GroupController = require('@controllers/GroupController');

const router = express.Router();

router.post('/groups/user', GroupController.addUser);

module.exports = router;
