const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init({
  userId: {
    type: DataTypes.INTEGER, // Sequelize.INTEGER 대신 DataTypes.INTEGER를 사용
    primaryKey: true,
    autoIncrement: true
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true,
  },
  naverId: {
    type: DataTypes.STRING,
    unique: true,
  },
  provider: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
  modelName: 'user'
});

module.exports = User;
