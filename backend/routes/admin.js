const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, SignupToken, Assignment } = require('../models');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Not admin' });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/generate-tokens', adminAuth, async (req, res) => {
  try {
    const { students } = req.body;
    const tokens = [];
    
    for (const student of students) {
      let user = await User.findOne({ where: { rollNumber: student.rollNumber } });
      if (!user) {
        user = await User.create({ ...student, isRegistered: true });
      }
      
      const existingToken = await SignupToken.findOne({ where: { userId: user.id } });
      if (existingToken) {
        tokens.push({ ...student, token: existingToken.token });
      } else {
        const token = crypto.randomBytes(32).toString('hex');
        await SignupToken.create({ token, userId: user.id });
        tokens.push({ ...student, token });
      }
    }
    
    res.json({ tokens });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Failed to generate tokens' });
  }
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: SignupToken, attributes: ['token', 'used'] }]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const registeredUsers = await User.count({ where: { isRegistered: true } });
    const assignments = await Assignment.count();
    
    res.json({
      totalUsers,
      registeredUsers,
      matchedUsers: assignments
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;