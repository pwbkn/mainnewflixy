const serie = require('../models/Serie');
const episode = require('../models/Episode');
const season = require('../models/Season');


const Source = require('../models/Source');
const Genre = require('../models/Genre');
const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');
const { body, validationResult } = require('express-validator');
const { Op } = require("sequelize");









router.post('/admin/series/create', middlewares.checkAuth,async (req, res,next) => {

  var data = req.body;

// console.log(req.body);

 if(data.genre){
  const genre = await Genre.findOne({where: {name:  data.genrename,type:"serie"}});

  if(!genre){
 const jane = await Genre.create({ name: data.genrename,type:"serie" });
 
 data.genre = jane.id;
  }

 }


  var mo =  await serie.create(data);
 var seasosn = await season.create({ name: "Season 1",serie_id:mo.id,type:"serie" ,web_only:false,app_only:false});

  //  res.render('serie/editserie.ejs',{ olddata:mo });
  res.redirect('/admin/seasons?id='+mo.id);

})


router.get('/admin/series/create', middlewares.checkAuth, async (req, res,next) => {
   res.render('serie/createserie.ejs');
})

// router.get('/admin/series/addsrc', middlewares.checkAuth, async (req, res,next) => {
//    res.render('serie/addsrc.ejs');
// })




router.post('/admin/serie/edit/:id',middlewares.checkAuth,async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await serie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }
  // console.log(req.body);
  // console.log(   Array.from(req.body)
// );
  Object.entries(req.body).forEach((e,i)=>{
    user[e[0]] = e[1];
  });
  await user.save();
    res.redirect('/admin/serie/edit?id='+id);
})

router.get('/admin/serie/edit',middlewares.checkAuth, async (req, res,next) => {
  const id = Number.parseInt(req.query.id);
  var error;
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
   }

  var  user = await serie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

   res.render('serie/editserie.ejs', { olddata:user });
})


router.get('/admin/serie/delete/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await serie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

  await serie.destroy({where: {id: id}});
  var {count:noofseasom,rows:sesaonssss}  = await season.findAndCountAll({where: {serie_id: id}});


  var delsesaon =  await sesaon.destroy({where: {serie_id: id}});


if(noofseasom > 0){

  for (const ss of sesaonssss) {
  //  var delsesaon =  await ss.destroy();

    var {count:noofep,rows:episodestodelete}  = await episode.findAndCountAll({where: {season_id: ss.id}});

if(noofep > 0){

    for (const singep of episodestodelete){
      var sors  = await  Source.destroy({where: {episode_id: singep.id}});
    }
}


   var delep = await episode.destroy({where: {season_id: ss.id}});
  }
}



    res.redirect('/admin/series');
})



router.get('/admin/serie/delete',middlewares.checkAuth, async (req, res) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await serie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

   res.render('serie/deleteserie.ejs', { olddata:user });

})














router.get('/admin/series',middlewares.checkAuth, middlewares.pagination,  async (req, res) => {
   var count, rows;

   const { page, size } = req.pagination;


   if(req.query.search)
   {
     var query = req.query.search;
 var { count, rows } = await serie.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
  where: {
    name:{
    [Op.like]: '%' + query + '%'
    }
  },
    limit: size,
    offset: page * size 
  });

 
   }else{
     
 var { count, rows } = await serie.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
    limit: size,
    offset: page * size 
  });
   }


  // console.log(count);
  var totalPages = Math.ceil(count / Number.parseInt(size));

  // res.send({
  //   content: usersWithCount.rows,
  //   totalPages 
  // });

   res.render('serie.ejs', { pages: totalPages,currpage: page+1,data:rows });


});





















//season handler


router.get('/admin/season/createbulkepisode/:seasonid', middlewares.checkAuth,async (req, res,next) => {

  var data = req.query.episode_no;
  var start = req.query.episode_no_start;
  var season_id = req.params.seasonid;

    if (Number.isNaN(season_id)) {
     res.redirect('/admin/series');
    }


    if (Number.isNaN(data)) {
  res.redirect('/admin/episodes?id='+season_id);
  }

  if(start){
    for(let i = start; i <= data; i++) {

      const user = {
        name: `Episode ${i}`,
        web_only: false,
        app_only: false,
        season_id: season_id,
      }

      await episode.create(user);
    }
  }else{
        for(let i = 1; i <= data; i++) {

      const user = {
        name: `Episode ${i}`,
        web_only: false,
        app_only: false,
        season_id: season_id,
      }

      await episode.create(user);
    }
  }


  //  res.render('serie/editserie.ejs',{ olddata:mo });
  res.redirect('/admin/episodes?id='+season_id);

});






router.get('/admin/seasons', middlewares.checkAuth,async (req, res,next) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await serie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

 const {count,rows} =  await season.findAndCountAll({where: {serie_id: id}});

  res.render('serie/seasons.ejs', { data:rows,olddata:user });

  //  res.render('serie/editserie.ejs',{ olddata:mo });
  // res.redirect('/admin/serie/seasons?id='+season_id);

});


router.get('/admin/seasons/create', middlewares.checkAuth,async (req, res,next) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await serie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }


  res.render('serie/createseason.ejs',{ data:user });

  //  res.render('serie/editserie.ejs',{ olddata:mo });
  // res.redirect('/admin/serie/seasons?id='+season_id);

});

router.post('/admin/seasons/create', middlewares.checkAuth,async (req, res,next) => {

  const serie_id = Number.parseInt(req.query.id); // serie_id

  if (Number.isNaN(serie_id)) {
    res.redirect('/admin/series');
  }
  const user = await serie.findOne({where: {id: serie_id}});
    if(!user) {
    res.redirect('/admin/series');
  }
  
  var data = req.body;
  data["serie_id"] = serie_id;

  var sesaons = season.create(data);


  // res.render('serie/createseason.ejs');
  //  res.render('serie/editserie.ejs',{ olddata:mo });
  res.redirect('/admin/seasons?id='+serie_id);

});




router.get('/admin/seasons/edit', middlewares.checkAuth,async (req, res,next) => {

  const season_id = Number.parseInt(req.query.id);

  if (Number.isNaN(season_id)) {
    res.redirect('/admin/series');
  }
  const user = await season.findOne({where: {id: season_id}});
    if(!user) {
    res.redirect('/admin/series');
  }


  res.render('serie/editseason.ejs',{olddata:user});

  //  res.render('serie/editserie.ejs',{ olddata:mo });
  // res.redirect('/admin/serie/seasons?id='+season_id);

});


router.post('/admin/seasons/edit', middlewares.checkAuth,async (req, res,next) => {

  const season_id = Number.parseInt(req.query.id);

  if (Number.isNaN(season_id)) {
    res.redirect('/admin/series');
  }
  const user = await season.findOne({where: {id: season_id}});
    if(!user) {
    res.redirect('/admin/series');
  }


  Object.entries(req.body).forEach((e,i)=>{
    user[e[0]] = e[1];
  });

  await user.save();

res.redirect('/admin/seasons?id='+user["serie_id"]);

  //  res.render('serie/editserie.ejs',{ olddata:mo });
  // res.redirect('/admin/serie/seasons?id='+season_id);

});





router.get('/admin/seasons/delete/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await season.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }


    var {count:noofep,rows:episodestodelete}  = await episode.findAndCountAll({where: {season_id: user.id}});

if(noofep > 0){
    for (const singep of episodestodelete){
      var sors  = await  Source.destroy({where: {episode_id: singep.id}});
    }
}


   var delep = await episode.destroy({where: {season_id: user.id}});


  await season.destroy({where: {id: id}});


res.redirect('/admin/seasons?id='+user["serie_id"]);
});


router.get('/admin/seasons/deleteallep/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await season.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }


    var {count:noofep,rows:episodestodelete}  = await episode.findAndCountAll({where: {season_id: user.id}});

if(noofep > 0){
    for (const singep of episodestodelete){
      var sors  = await  Source.destroy({where: {episode_id: singep.id}});
    }
}


   var delep = await episode.destroy({where: {season_id: user.id}});


  // await season.destroy({where: {id: id}});


res.redirect('/admin/episodes?id='+user["id"]);
});

router.get('/admin/seasons/delete',middlewares.checkAuth, async (req, res) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await season.findOne({where: {id: id}});


    if(!user) {
    res.redirect('/admin/series');
  }

  const user1 = await serie.findOne({where: {id: user["serie_id"]}});

      if(!user1) {
    res.redirect('/admin/series');
  }

   res.render('serie/delseason.ejs', { olddata:user ,serie:user1});

})


//season handler









//episode handler





router.get('/admin/episodes', middlewares.checkAuth,async (req, res,next) => {

  const id = Number.parseInt(req.query.id); //season_id
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await season.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

 const {count,rows} =  await episode.findAndCountAll({where: {season_id: id}});

  res.render('episode/episodes.ejs', { data:rows,olddata:user });

  //  res.render('serie/editserie.ejs',{ olddata:mo });
  // res.redirect('/admin/serie/episodes?id='+episode_id);

});


router.get('/admin/episodes/create', middlewares.checkAuth,async (req, res,next) => {

  const id = Number.parseInt(req.query.id);  //season_id
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await season.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }


  res.render('episode/create.ejs',{ olddata:user });

  //  res.render('serie/editserie.ejs',{ olddata:mo });
  // res.redirect('/admin/serie/episodes?id='+episode_id);

});

router.post('/admin/episodes/create', middlewares.checkAuth,async (req, res,next) => {

  const season_id = Number.parseInt(req.query.id); //season_id

  if (Number.isNaN(season_id)) {
    res.redirect('/admin/series');
  }
  const user = await season.findOne({where: {id: season_id}});
    if(!user) {
    res.redirect('/admin/series');
  }
  
  var data = req.body;
  data["season_id"] = season_id;

  var sesaons = episode.create(data);


  // res.render('season/createepisode.ejs');
  //  res.render('season/editseason.ejs',{ olddata:mo });
  res.redirect('/admin/episodes?id='+season_id);

});




router.get('/admin/episodes/edit', middlewares.checkAuth,async (req, res,next) => {

  const episode_id = Number.parseInt(req.query.id);

  if (Number.isNaN(episode_id)) {
    res.redirect('/admin/series');
  }
  const user = await episode.findOne({where: {id: episode_id}});
    if(!user) {
    res.redirect('/admin/series');
  }


  res.render('episode/edit.ejs',{olddata:user});

  //  res.render('serie/editserie.ejs',{ olddata:mo });
  // res.redirect('/admin/serie/episodes?id='+episode_id);

});


router.post('/admin/episodes/edit', middlewares.checkAuth,async (req, res,next) => {

  const episode_id = Number.parseInt(req.query.id);

  if (Number.isNaN(episode_id)) {
    res.redirect('/admin/series');
  }
  const user = await episode.findOne({where: {id: episode_id}});
    if(!user) {
    res.redirect('/admin/series');
  }


  Object.entries(req.body).forEach((e,i)=>{
    user[e[0]] = e[1];
  });

  await user.save();

res.redirect('/admin/episodes?id='+user["season_id"]);

  //  res.render('serie/editserie.ejs',{ olddata:mo });
  // res.redirect('/admin/serie/episodes?id='+episode_id);

});





router.get('/admin/episodes/delete/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await episode.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

  await episode.destroy({where: {id: id}});

res.redirect('/admin/episodes?id='+user["season_id"]);
})


router.get('/admin/episodes/delete',middlewares.checkAuth, async (req, res) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await episode.findOne({where: {id: id}});
    if(!user ) {
    res.redirect('/admin/series');
  }


  const user1 = await season.findOne({where: {id: user["season_id"]}});

    if( !user1) {
    res.redirect('/admin/series');
  }

   res.render('episode/del.ejs', { olddata:user ,season:user1});

})

//episode handler









//sources for episodes


router.get('/admin/episode/addsrc',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const ep = await episode.findOne({where: {id: id}});


    if(!ep) {
    // res.redirect('/admin/episodes?season='+season.id);
      res.redirect('/admin/series');
  }

  const seasonr = await season.findOne({where: {id: ep.season_id}});


    if(!seasonr) {
    // res.redirect('/admin/episodes?season='+season.id);
      res.redirect('/admin/series');
  }

    const series = await serie.findOne({where: {id: seasonr.serie_id}});

    if(!series) {
    // res.redirect('/admin/episodes?season='+season.id);
      res.redirect('/admin/series');
  }


   res.render('episode/addsrc.ejs', { season:seasonr,ep:ep,serie:series});
})



router.post('/admin/episode/addsrc', middlewares.checkAuth,async (req, res,next) => {

  var data = req.body;
  var id = req.query.id;

  // var season_id = req.query.season_id;

  data['episode_id'] = id;

// console.log(req.body);
  var mo =  await Source.create(data);

  //  res.render('episode/editepisode.ejs',{ olddata:mo });
  res.redirect('/admin/episode/sources?id='+id)
})





router.get('/admin/episode/delsrc/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

  await Source.destroy({where: {id: id}});

    res.redirect('/admin/episode/sources?id='+user.episode_id);
})


router.get('/admin/episode/delsrc',middlewares.checkAuth, async (req, res) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

   res.render('episode/delsrc.ejs', { olddata:user });

})


router.post('/admin/episode/editsrc/:id',middlewares.checkAuth,async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }

  const user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
    console.log('not found');
  }
  // console.log(req.body);
  // console.log(   Array.from(req.body)
// );
  Object.entries(req.body).forEach((e,i)=>{
    user[e[0]] = e[1];
  });

  await user.save();

    res.redirect('/admin/episode/sources?id='+user["episode_id"]);
})

router.get('/admin/episode/editsrc',middlewares.checkAuth, async (req, res,next) => {
  const id = Number.parseInt(req.query.id);
  var error;
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
   }

  var  user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

  var  user1 = await episode.findOne({where: {id: user["episode_id"]}});

    if(!user1) {
    res.redirect('/admin/series');
  }


   res.render('episode/editsrc.ejs', { oldsrc:user,olddata:user1 });
})



router.get('/admin/episode/sources',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/series');
  }
  const user = await episode.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/series');
  }

 const {count,rows} =  await Source.findAndCountAll({where: {episode_id: id}});

   res.render('episode/sources.ejs', { olddata:user,data:rows,noofsrc:count });
})

//sources for episodes

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

module.exports = router;
