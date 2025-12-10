const { sequelize, Student, Assignment } = require('../models');

const revealFriend = async (req, res) => {
  const { studentId } = req.body;

  if (!studentId || isNaN(studentId)) {
    return res.status(400).json({ error: 'Valid studentId required' });
  }

  const transaction = await sequelize.transaction();
  
  try {
    const existingAssignment = await Assignment.findOne({ 
      where: { studentId },
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
    const availableFriends = allStudents.filter(student => 
      !assignedFriendIds.includes(student.id) && student.id != studentId
    );

    if (availableFriends.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'No friends available' });
    }

    const randomFriend = availableFriends[Math.floor(Math.random() * availableFriends.length)];
    
    await Assignment.create({
      studentId,
      friendId: randomFriend.id
    }, { transaction });

    await transaction.commit();
    res.json({ friendName: randomFriend.name });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: 'Server error' });
  }
};

const getStatus = async (req, res) => {
  const { studentId } = req.params;

  if (isNaN(studentId)) {
    return res.status(400).json({ error: 'Valid studentId required' });
  }

  try {
    const assignment = await Assignment.findOne({ 
      where: { studentId },
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