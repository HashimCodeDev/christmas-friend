const { sequelize, Student } = require('./models');
require('dotenv').config();

const students = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Brown',
  'Diana Prince',
  'Edward Norton',
  'Fiona Green',
  'George Wilson',
  'Hannah Davis',
  'Ian Thompson',
  'Julia Roberts'
];

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    
    const studentDocs = students.map(name => ({ name }));
    await Student.bulkCreate(studentDocs);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();