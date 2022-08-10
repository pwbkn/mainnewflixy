const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Genre extends Model {};

Genre.init({
  name: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.STRING
    // movie serie or channel
  },
}, {
  sequelize,
  modelName: 'genre',
})

module.exports = Genre;