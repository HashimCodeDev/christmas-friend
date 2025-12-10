const { sequelize, Student } = require('./models');
require('dotenv').config();

const students = [
  { name: 'Alice Johnson', email: 'alice@mec.ac.in' },
  { name: 'Bob Smith', email: 'bob@mec.ac.in' },
  { name: 'Charlie Brown', email: 'charlie@mec.ac.in' },
  { name: 'Diana Prince', email: 'diana@mec.ac.in' },
  { name: 'Edward Norton', email: 'edward@mec.ac.in' },
  { name: 'Fiona Green', email: 'fiona@mec.ac.in' },
  { name: 'George Wilson', email: 'george@mec.ac.in' },
  { name: 'Hannah Davis', email: 'hannah@mec.ac.in' },
  { name: 'Ian Thompson', email: 'ian@mec.ac.in' },
  { name: 'Julia Roberts', email: 'julia@mec.ac.in' }
];

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    
    await Student.bulkCreate(students);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();