const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const COLLEGE_DOMAIN = process.env.COLLEGE_DOMAIN || '@college.edu';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, email_verified, name } = payload;
    
    if (!email_verified) {
      return res.status(400).json({ error: 'Email not verified' });
    }
    

    
    const authToken = jwt.sign({ email, name }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token: authToken, email, name });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;