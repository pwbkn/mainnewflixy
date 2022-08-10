const Movie = require('../models/Movie');
const Channel = require('../models/Channel');
const Serie = require('../models/Serie');
const Genre = require('../models/Genre');
const Source = require('../models/Source');
const Season = require('../models/Season');
const Episode = require('../models/Episode');
const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");

const middlewares = require('../middlewares');


router.get('/api/web/movies', middlewares.pagination, async (req, res) => {

   const { page, size } = req.pagination;

   var usersWithCount = null;

  if(req.query.genre){
   usersWithCount = await Movie.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
  where: {genre: req.query.genre},

    limit: size,
    offset: page * size 
  });

  }else{

   usersWithCount = await Movie.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
    limit: size,
    offset: page * size 
  });

  }

  res.send({
    content: usersWithCount.rows,
    totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size))
  });


});


router.get('/api/web/series', middlewares.pagination, async (req, res) => {

   const { page, size } = req.pagination;

   var usersWithCount = null;

  if(req.query.genre){
   usersWithCount = await Serie.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
  where: {genre: req.query.genre},

    limit: size,
    offset: page * size 
  });

  }else{

   usersWithCount = await Serie.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
    limit: size,
    offset: page * size 
  });

  }

  res.send({
    content: usersWithCount.rows,
    totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size))
  });


});

router.get('/api/web/channels', middlewares.pagination, async (req, res) => {

   const { page, size } = req.pagination;

   var usersWithCount = null;

  if(req.query.genre){
   usersWithCount = await Channel.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
  where: {genre: req.query.genre},

    limit: size,
    offset: page * size 
  });

  }else{

   usersWithCount = await Channel.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
    limit: size,
    offset: page * size 
  });

  }

  
  res.send({
    content: usersWithCount.rows,
    totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size))
  });


});

router.get('/api/web/genres', async (req, res) => {
 var usersWithCount = null;

  if(req.query.type){

   usersWithCount = await Genre.findAll({
      where: {type: req.query.type},
      order: [
    ['createdAt', 'DESC'],
  ],
  });

  }else{
   usersWithCount = await Genre.findAll({
      order: [
    ['createdAt', 'DESC'],
  ],
  });

  
  }


if(!usersWithCount){
  res.send({"id":"N/A","name":"No Genre"});
}

res.send(usersWithCount);



});

router.get('/api/web/genre/:id', async (req, res) => {
  var id = req.params.id;
  const usersWithCount = await Genre.findOne({
  where: {id: id},
})
if(!usersWithCount){
  res.send({"id":"N/A","name":"No Genre"});
}

res.send(usersWithCount);
});



router.get('/api/web/movie/:id', async (req, res) => {
  var id = req.params.id;
  const usersWithCount = await Movie.findOne({
  where: {id: id},
})
if(!usersWithCount){
  res.send({"id":"N/A","name":"No Movie"});
}

res.send(usersWithCount);
});


router.get('/api/web/serie/:id', async (req, res) => {
  var id = req.params.id;
  const usersWithCount = await Serie.findOne({
  where: {id: id},
})
if(!usersWithCount){
  res.send({"id":"N/A","name":"No Serie"});
}

res.send(usersWithCount);
});

router.get('/api/web/channel/:id', async (req, res) => {
  var id = req.params.id;
  const usersWithCount = await Channel.findOne({
  where: {id: id},
})
if(!usersWithCount){
  res.send({"id":"N/A","name":"No Channel"});
}

res.send(usersWithCount);
});







router.get('/api/web/movie/alldata/:id', async (req, res) => {
  var id = req.params.id;
  var usersWithCount = await Movie.findOne({
  where: {id: id},
})

if(!usersWithCount){
  res.send({"id":"N/A","name":"No Movie"});
}else{
 var sources = await Source.findAll({
  where: {movie_id: id},
});

}

res.send({...usersWithCount.dataValues,sources:sources.map((r) => {
      return r.dataValues;
    })});
});



router.get('/api/web/channel/alldata/:id', async (req, res) => {
  var id = req.params.id;
  var usersWithCount = await Channel.findOne({
  where: {id: id},
})

if(!usersWithCount){
  res.send({"id":"N/A","name":"No Channel"});
}else{
 var sources = await Source.findAll({
  where: {channel_id: id},
});

}

res.send({...usersWithCount.dataValues,sources:sources.map((r) => {
      return r.dataValues;
    })});
});

router.get('/api/web/serie/alldata/:id', async (req, res) => {
  var id = req.params.id;
  var usersWithCount = await Serie.findOne({
  where: {id: id},
})

if(!usersWithCount){
  res.send({"id":"N/A","name":"No Serie"});
}else{

var sendingseasons = [];
 var {count:noofseasom,rows:sesaonssss}  = await Season.findAndCountAll({where: {serie_id: id}});


if(noofseasom > 0){

  for (var ss of sesaonssss) {
    var current_season = ss.dataValues;
    current_season['episodes'] = [];

  //  var delsesaon =  await ss.destroy();
    var {count:noofep,rows:episodestodelete}  = await Episode.findAndCountAll({where: {season_id: ss.id}});

if(noofep > 0){

    for (var singep of episodestodelete){
      var curr_ep = singep.dataValues;
      var sors  = await  Source.findAll({where: {episode_id: singep.id}});

      curr_ep.sources = sors;
      current_season.episodes.push(curr_ep);
      // console.log(singep)
    }
}
    sendingseasons.push(current_season);

  }
}


}

res.send({...usersWithCount.dataValues,seasons:sendingseasons.map((r) => {
      return r;
    })});
});




router.get('/api/web/search/:query', async (req, res) => {
  var query = req.params.query;
  var cWithCount = await Channel.findAll({
  where: {
    name:{
    [Op.like]: '%' + query + '%'
    }
  },
    limit: 15,
});

  var mWithCount = await Movie.findAll({
  where: {
    name:{
    [Op.like]: '%' + query + '%'
    }
  },
    limit: 15,
});


  var sWithCount = await Serie.findAll({
  where: {
    name:{
    [Op.like]: '%' + query + '%'
    }
  },
    limit: 15,
});

if(!mWithCount && !sWithCount && !cWithCount){
  res.send({"id":"N/A","error":"No Data Matched"});
}else{
var final_array = [];
final_array.push(mWithCount);
final_array.push(sWithCount);
final_array.push(cWithCount);

res.send(final_array);

}
});

module.exports = router;
