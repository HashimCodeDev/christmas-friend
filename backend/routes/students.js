const express = require('express');
const { revealFriend, getStatus, getStudents } = require('../controllers/studentController');

const router = express.Router();

router.post('/reveal', revealFriend);
router.get('/status/:studentId', getStatus);
router.get('/students', getStudents);

module.exports = router;