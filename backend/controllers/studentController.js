const { sequelize, User, Assignment } = require('../models');

const revealFriend = async (req, res) => {
  const { userId } = req.user;

  const transaction = await sequelize.transaction();
  
  try {
    const existingAssignment = await Assignment.findOne({ 
      where: { userId },
      transaction
    });
    
    if (existingAssignment) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Friend already assigned' });
    }

    const allUsers = await User.findAll({ where: { isRegistered: true }, transaction });
    const assignments = await Assignment.findAll({ 
      attributes: ['friendUserId'],
      transaction
    });
    
    const assignedFriendIds = assignments.map(a => a.friendUserId).filter(Boolean);
    const availableFriends = allUsers.filter(u => 
      !assignedFriendIds.includes(u.id) && u.id !== userId
    );

    if (availableFriends.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'No friends available' });
    }

    const randomFriend = availableFriends[Math.floor(Math.random() * availableFriends.length)];
    
    await Assignment.create({
      userId,
      friendUserId: randomFriend.id
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
  const { userId } = req.user;

  try {
    const assignment = await Assignment.findOne({ 
      where: { userId },
      include: [{ model: User, as: 'friendUser', attributes: ['name'] }]
    });
    
    if (assignment && assignment.friendUser) {
      res.json({ 
        hasAssignment: true, 
        friendName: assignment.friendUser.name 
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