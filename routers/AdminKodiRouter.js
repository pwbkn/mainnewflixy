const channel = require('../models/Channel');
const Source = require('../models/Source');
const Genre = require('../models/Genre');
const Movie = require('../models/Movie');
const Serie = require('../models/Serie');
const Season = require('../models/Season');
const Episode = require('../models/Episode');
const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');
const { body, validationResult } = require('express-validator');
const { Op } = require("sequelize");



router.get('/kodi/channels',  async (req, res) => {

 var { count, rows } = await channel.findAndCountAll({
         order: [
    ['createdAt', 'DESC'],
  ]
 });


 var finaldata = [];

    for (const element of rows) {

     
    var sources = await Source.findAll({
        where: {channel_id: element.id},
      });

      sources.forEach(source => {
        var namearr = [];

         namearr.push(element['name']);
         namearr.push(source['name']);
         namearr.push(source['quality']);


        finaldata.push(
            {'name':namearr.join(' '),
            'des':element['description'],'video':source['url'],'genre':'Channels','thumb':element['thumb'],'cover':element['poster'],'videoLic':source['drmkey']}
            );

       });


    };


    res.send(JSON.stringify(finaldata));
});


router.get('/kodi/movies',  async (req, res) => {

var finaldata = [];
 var { count, rows } = await Movie.findAndCountAll(
   {
           order: [
    ['createdAt', 'DESC'],
  ]
   }
 );




    for (const element of rows) {

     
    var sources = await Source.findAll({
        where: {movie_id: element.id},
      });

      sources.forEach(source => {
       
        var namearr = [];


         namearr.push(element['name']);
         namearr.push(source['name']);
         namearr.push(source['quality']);

         if(element['relasedate']){
            namearr.push(element['relasedate'].toString().substring(11, 15));
        }


        if(element['runtime']){
            namearr.push('Duration - '+element['runtime']);
        }





        finaldata.push(
            {'name':namearr.join(' '),
            'des':element['description'],'video':source['url'],'genre':'Movies','thumb':element['thumb'],'cover':element['poster'],'videoLic':source['drmkey']}
            );

       });


    };








res.send(JSON.stringify(finaldata));

});



router.get('/kodi/series',  async (req, res) => {

 var { count, rows } = await Serie.findAndCountAll(
   {
           order: [
    ['createdAt', 'DESC'],
  ]
   }
 );

var finaldata = {};

    for (const element of rows) {

        var seasons = await Season.findAll({
            where: {serie_id: element.id},
          });


          for (const season of seasons) {


            
        var episodes = await Episode.findAll({
            where: {season_id: season.id},
          });


          for (const episode of episodes) {

     
    var sources = await Source.findAll({
        where: {episode_id: episode.id},
      });

      sources.forEach(source => {
        var namearr = [];

         namearr.push(element['name']);
         namearr.push(season['name']);
         namearr.push(episode['name']);

         namearr.push(source['name']);
         namearr.push(source['quality']);

         if(element['relasedate']){
            namearr.push(element['relasedate'].toString().substring(0, 4));
        }


       if(!(finaldata[element['name']+'-Web-Series'])){
         finaldata[element['name']+'-Web-Series'] = [];
       }

        finaldata[element['name']+'-Web-Series'].push({'name':namearr.join(' '),
            'des':element['description'],'video':source['url'],'genre':element['name']+'-Web-Series','thumb':element['thumb'],'cover':element['poster'],'videoLic':source['drmkey']});
           

       });

    }

    }

    };


    res.send(JSON.stringify(finaldata));

});





module.exports = router;
