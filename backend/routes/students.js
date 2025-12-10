const express = require('express');
const { revealFriend, getStatus, getStudents } = require('../controllers/studentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/reveal', authenticateToken, revealFriend);
router.get('/status', authenticateToken, getStatus);
router.get('/students', getStudents);

module.exports = router;