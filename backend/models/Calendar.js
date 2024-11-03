const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // User 모델을 가져옴

class Calendar extends Model {}

Calendar.init({
  calendarId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // User 모델을 참조
      key: 'userId', // User 모델의 기본 키
    },
    onDelete: 'CASCADE', // 유저가 삭제되면 관련된 캘린더 이벤트도 삭제됨
  },
  alias: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  backgroundColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'calendars'
});

// User 모델과의 관계 설정
Calendar.belongsTo(User, { foreignKey: 'userId' });

module.exports = Calendar;
