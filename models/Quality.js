const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Quality extends Model {};

Quality.init({
  name: {
    type: DataTypes.STRING
  },
  type:{
         type: DataTypes.STRING
  },
}, {
  sequelize,
  modelName: 'quality',
})

module.exports = Quality;