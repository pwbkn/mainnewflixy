const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Episode extends Model {};

Episode.init({
  name: {
    type: DataTypes.STRING
  },
  subtitle: {
    type: DataTypes.STRING
  },
   season_id:{
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
  modelName: 'episode',
  timestamps: false
})

module.exports = Episode;