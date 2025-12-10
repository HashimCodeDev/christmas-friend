const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://hashim@localhost:5432/christmas_friend', {
  dialect: 'postgres',
  logging: false
});

const Student = require('./Student')(sequelize);
const Assignment = require('./Assignment')(sequelize);
const User = require('./User')(sequelize);
const SignupToken = require('./SignupToken')(sequelize);

Student.hasOne(Assignment, { foreignKey: 'studentId' });
Assignment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Assignment.belongsTo(Student, { foreignKey: 'friendId', as: 'friend' });

User.hasOne(SignupToken, { foreignKey: 'userId' });
SignupToken.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Assignment, { foreignKey: 'userId' });
Assignment.belongsTo(User, { foreignKey: 'userId' });
Assignment.belongsTo(User, { foreignKey: 'friendUserId', as: 'friendUser' });

module.exports = { sequelize, Student, Assignment, User, SignupToken };