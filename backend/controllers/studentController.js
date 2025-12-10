const { sequelize, Student, Assignment } = require('../models');

const revealFriend = async (req, res) => {
  const { email, name } = req.user;

  if (!email) {
    return res.status(400).json({ error: 'Authentication required' });
  }

  const transaction = await sequelize.transaction();
  
  try {
    let student = await Student.findOne({ where: { email }, transaction });
    if (!student) {
      student = await Student.create({ email, name }, { transaction });
    }

    const existingAssignment = await Assignment.findOne({ 
      where: { studentId: student.id },
      transaction
    });
    
    if (existingAssignment) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Friend already assigned' });
    }

    const allStudents = await Student.findAll({ transaction });
    const assignments = await Assignment.findAll({ 
      attributes: ['friendId'],
      transaction
    });
    
    const assignedFriendIds = assignments.map(a => a.friendId);
    const availableFriends = allStudents.filter(s => 
      !assignedFriendIds.includes(s.id) && s.id !== student.id
    );

    if (availableFriends.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'No friends available' });
    }

    const randomFriend = availableFriends[Math.floor(Math.random() * availableFriends.length)];
    
    await Assignment.create({
      studentId: student.id,
      friendId: randomFriend.id
    }, { transaction });

    await transaction.commit();
    res.json({ friendName: randomFriend.name });
  } catch (error) {
    await transaction.rollback();
    console.error('Reveal friend error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getStatus = async (req, res) => {
  const { email } = req.user;

  try {
    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.json({ hasAssignment: false });
    }

    const assignment = await Assignment.findOne({ 
      where: { studentId: student.id },
      include: [{ model: Student, as: 'friend', attributes: ['name'] }]
    });
    
    if (assignment) {
      res.json({ 
        hasAssignment: true, 
        friendName: assignment.friend.name 
      });
    } else {
      res.json({ hasAssignment: false });
    }
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({ attributes: ['id', 'name'] });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { revealFriend, getStatus, getStudents };