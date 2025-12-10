const { Student } = require('./models');
require('dotenv').config();

const getStudentIds = async () => {
  try {
    const students = await Student.findAll();
    console.log('Student IDs:');
    students.forEach(student => {
      console.log(`${student.name}: ${student.id}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

getStudentIds();