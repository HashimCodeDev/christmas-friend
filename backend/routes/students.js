const express = require('express');
const { revealFriend, getStatus } = require('../controllers/studentController');

const router = express.Router();

router.post('/reveal', revealFriend);
router.get('/status/:studentId', getStatus);

module.exports = router;