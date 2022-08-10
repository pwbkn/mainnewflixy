const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Movie extends Model {};

Movie.init({
  name: {
    type: DataTypes.STRING
  },
  tagline: {
    type: DataTypes.STRING
  },
    subtitle: {
    type: DataTypes.STRING
  },
  runtime: {
    type: DataTypes.INTEGER
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
    tmdb:{
    type:DataTypes.INTEGER
  },
     popularity: {
    type: DataTypes.STRING
  },  
   vote: {
    type: DataTypes.STRING
  },
     trailer: {
    type: DataTypes.STRING
  },
  relasedate: {
    type: DataTypes.DATE
  },
    web_only:{
    type: DataTypes.BOOLEAN,
  },
  app_only:{
    type: DataTypes.BOOLEAN,
  }
}, {
  sequelize,
  modelName: 'movie',
})

module.exports = Movie;