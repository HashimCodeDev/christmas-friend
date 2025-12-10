const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, SignupToken } = require('../models');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', async (req, res) => {
  try {
    const { token } = req.body;
    console.log('Registration attempt with token:', token);
    
    const signupToken = await SignupToken.findOne({ 
      where: { token },
      include: [User]
    });
    
    console.log('Found token:', signupToken ? 'Yes' : 'No');
    
    if (!signupToken) {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    if (signupToken.used) {
      return res.status(400).json({ error: 'Token already used' });
    }
    
    await SignupToken.update(
      { used: true },
      { where: { id: signupToken.id } }
    );
    
    const user = await User.findByPk(signupToken.userId);
    const authToken = jwt.sign({ userId: user.id, rollNumber: user.rollNumber }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token: authToken, user: { rollNumber: user.rollNumber, name: user.name } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { rollNumber } = req.body;
    
    const user = await User.findOne({ where: { rollNumber, isRegistered: true } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const authToken = jwt.sign({ userId: user.id, rollNumber: user.rollNumber }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token: authToken, user: { rollNumber: user.rollNumber, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;