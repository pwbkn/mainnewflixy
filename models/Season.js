const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Season extends Model {};

Season.init({
  name: {
    type: DataTypes.STRING
  },
   serie_id:{
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
  modelName: 'season',
  timestamps: false
})

module.exports = Season;