const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://hashim@localhost:5432/christmas_friend', {
  dialect: 'postgres',
  logging: false
});

const Student = require('./Student')(sequelize);
const Assignment = require('./Assignment')(sequelize);

Student.hasOne(Assignment, { foreignKey: 'studentId' });
Assignment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Assignment.belongsTo(Student, { foreignKey: 'friendId', as: 'friend' });

module.exports = { sequelize, Student, Assignment };