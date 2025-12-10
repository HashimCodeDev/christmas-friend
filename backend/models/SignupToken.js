const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('SignupToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};