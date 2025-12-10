const { sequelize, User, SignupToken } = require('./models');
const crypto = require('crypto');
require('dotenv').config();

const classList = [
  { rollNumber: 'CS001', name: 'Alice Johnson' },
  { rollNumber: 'CS002', name: 'Bob Smith' },
  { rollNumber: 'CS003', name: 'Charlie Brown' },
  { rollNumber: 'CS004', name: 'Diana Prince' },
  { rollNumber: 'CS005', name: 'Edward Norton' }
];

const generateTokens = async () => {
  try {
    await sequelize.sync({ force: true });
    
    for (const student of classList) {
      const user = await User.create({ ...student, isRegistered: true });
      const token = crypto.randomBytes(32).toString('hex');
      await SignupToken.create({ token, userId: user.id });
      console.log(`${student.rollNumber} (${student.name}): ${token}`);
    }
    
    console.log('\nTokens generated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Token generation failed:', error);
    process.exit(1);
  }
};

generateTokens();