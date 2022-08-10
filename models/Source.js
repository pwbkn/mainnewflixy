const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Source extends Model {};

Source.init({
  name: {
    type: DataTypes.STRING
  },
   url: {
    type: DataTypes.STRING
  },
  ext:{
    type: DataTypes.STRING
    // m3u8,mp4,mpd
  },
    drmkey:{
    type: DataTypes.STRING
    // m3u8,mp4,mpd
  },
    type:{
    type: DataTypes.STRING
    // play,download,both
  },
    quality:{
    type:DataTypes.STRING
  },
  movie_id:{
    type:DataTypes.INTEGER
  }, 
   channel_id:{
    type:DataTypes.INTEGER
  },
   episode_id:{
    type:DataTypes.INTEGER
  },
    web_only:{
    type: DataTypes.BOOLEAN,
  },
  app_only:{
    type: DataTypes.BOOLEAN,
  },
}, {
  sequelize,
  modelName: 'source',
  timestamps: false
})

module.exports = Source;