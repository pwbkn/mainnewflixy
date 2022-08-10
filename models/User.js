const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {};

User.init({
  username: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  isAdmin:{
    type: DataTypes.BOOLEAN,
  }
}, {
  sequelize,
  modelName: 'user',
})

module.exports = User;