const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Assignment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Students',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Students',
        key: 'id'
      }
    },
    friendUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    revealedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    indexes: [
      { fields: ['friendId'] }
    ]
  });
};