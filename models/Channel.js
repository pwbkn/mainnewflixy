const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Channel extends Model {};

Channel.init({
  name: {
    type: DataTypes.STRING
  },
  poster: {
    type: DataTypes.STRING
  },
  thumb: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  genre:{
    type:DataTypes.INTEGER
  },
      web_only:{
    type: DataTypes.BOOLEAN,
  },
  app_only:{
    type: DataTypes.BOOLEAN,
  }
}, {
  sequelize,
  modelName: 'channel',
})

module.exports = Channel;