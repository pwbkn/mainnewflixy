const Movie = require('../models/Movie');
const Source = require('../models/Source');
const Genre = require('../models/Genre');
const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');
const { body, validationResult } = require('express-validator');
const { Op } = require("sequelize");


router.post('/admin/movies/create', middlewares.checkAuth,async (req, res,next) => {

  var data = req.body;

// console.log(req.body);

 if(data.genre){
  const genre = await Genre.findOne({where: {name:  data.genrename,type:"movie"}});

  if(!genre){
 const jane = await Genre.create({ name: data.genrename,type:"movie" });
 
 data.genre = jane.id;
  }

 }
 

  var mo =  await Movie.create(data);

  //  res.render('movie/editmovie.ejs',{ olddata:mo });
  res.redirect('/admin/movie/sources?id='+mo.id)
})


router.get('/admin/movies/create', middlewares.checkAuth, async (req, res,next) => {
   res.render('movie/createmovie.ejs');
})

// router.get('/admin/movies/addsrc', middlewares.checkAuth, async (req, res,next) => {
//    res.render('movie/addsrc.ejs');
// })




router.post('/admin/movie/edit/:id',middlewares.checkAuth,async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
  }
  const user = await Movie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
  }
  // console.log(req.body);
  // console.log(   Array.from(req.body)
// );
  Object.entries(req.body).forEach((e,i)=>{
    user[e[0]] = e[1];
  });
  await user.save();
    res.redirect('/admin/movie/edit?id='+id);
})

router.get('/admin/movie/edit',middlewares.checkAuth, async (req, res,next) => {
  const id = Number.parseInt(req.query.id);
  var error;
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
   }

  var  user = await Movie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
  }

   res.render('movie/editmovie.ejs', { olddata:user });
})


router.get('/admin/movie/delete/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
  }
  const user = await Movie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
  }

  await Movie.destroy({where: {id: id}});
  await Source.destroy({where: {movie_id: id}});

    res.redirect('/admin/movies');
})



router.get('/admin/movie/delete',middlewares.checkAuth, async (req, res) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
  }
  const user = await Movie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
  }

   res.render('movie/deletemovie.ejs', { olddata:user });

})



router.get('/admin/movie/sources',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
  }
  const user = await Movie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
  }

 const {count,rows} =  await Source.findAndCountAll({where: {movie_id: id}});

   res.render('movie/sources.ejs', { olddata:user,data:rows,noofsrc:count });
})









router.get('/admin/movies',middlewares.checkAuth, middlewares.pagination,  async (req, res) => {
   var count, rows;

   const { page, size } = req.pagination;


   if(req.query.search)
   {
     var query = req.query.search;
 var { count, rows } = await Movie.findAndCountAll({
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
     
 var { count, rows } = await Movie.findAndCountAll({
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

   res.render('movie.ejs', { pages: totalPages,currpage: page+1,data:rows });


});












//sources 


router.get('/admin/movie/addsrc',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
  }
  const user = await Movie.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
  }

   res.render('movie/addsrc.ejs', { data:user});
})



router.post('/admin/movie/addsrc', middlewares.checkAuth,async (req, res,next) => {

  var data = req.body;
  var id = req.query.id;

  data['movie_id'] = id;

// console.log(req.body);
  var mo =  await Source.create(data);

  //  res.render('movie/editmovie.ejs',{ olddata:mo });
  res.redirect('/admin/movie/sources?id='+id)
})





router.get('/admin/movie/delsrc/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
  }
  const user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
  }

  await Source.destroy({where: {id: id}});

    res.redirect('/admin/movie/sources?id='+user.movie_id);
})


router.get('/admin/movie/delsrc',middlewares.checkAuth, async (req, res) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
  }
  const user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
  }

   res.render('movie/delsrc.ejs', { olddata:user });

})


router.post('/admin/movie/editsrc/:id',middlewares.checkAuth,async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
  }

  const user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
    console.log('not found');
  }
  // console.log(req.body);
  // console.log(   Array.from(req.body)
// );
  Object.entries(req.body).forEach((e,i)=>{
    user[e[0]] = e[1];
  });

  await user.save();

    res.redirect('/admin/movie/sources?id='+user["movie_id"]);
})

router.get('/admin/movie/editsrc',middlewares.checkAuth, async (req, res,next) => {
  const id = Number.parseInt(req.query.id);
  var error;
  if (Number.isNaN(id)) {
    res.redirect('/admin/movies');
   }

  var  user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/movies');
  }

  var  user1 = await Movie.findOne({where: {id: user["movie_id"]}});

    if(!user1) {
    res.redirect('/admin/movies');
  }


   res.render('movie/editsrc.ejs', { oldsrc:user,olddata:user1 });
})


//sources 


module.exports = router;
