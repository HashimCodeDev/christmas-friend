const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const studentRoutes = require('./routes/students');
const authRoutes = require('./routes/auth');
app.use('/api', studentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});