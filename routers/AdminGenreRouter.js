const genre = require('../models/Genre');
const channel = require('../models/Channel');
const movie = require('../models/Movie');
const serie = require('../models/Serie');

const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');
const { body, validationResult } = require('express-validator');
const { Op } = require("sequelize");


router.post('/admin/genres/create', middlewares.checkAuth,async (req, res,next) => {

  var data = req.body;

// console.log(req.body);
  var mo =  await genre.create(data);

  //  res.render('genre/editgenre.ejs',{ olddata:mo });
  res.redirect('/admin/genres');
})


router.get('/admin/genres/create', middlewares.checkAuth, async (req, res,next) => {
   res.render('genre/add.ejs');
})

// router.get('/admin/genres/addsrc', middlewares.checkAuth, async (req, res,next) => {
//    res.render('genre/addsrc.ejs');
// })




router.post('/admin/genre/edit',middlewares.checkAuth,async (req, res) => {
  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/genres');
  }
  const user = await genre.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/genres');
  }
  // console.log(req.body);
  // console.log(   Array.from(req.body)
// );
  Object.entries(req.body).forEach((e,i)=>{
    user[e[0]] = e[1];
  });

  await user.save();
    res.redirect('/admin/genre/edit?id='+id);
})

router.get('/admin/genre/edit',middlewares.checkAuth, async (req, res,next) => {
  const id = Number.parseInt(req.query.id);
  var error;
  if (Number.isNaN(id)) {
    res.redirect('/admin/genres');
   }

  var  user = await genre.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/genres');
  }

   res.render('genre/edit.ejs', { olddata:user });
})


router.get('/admin/genre/delete/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/genres');
  }
  const user = await genre.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/genres');
  }

  var deleted =  await genre.destroy({where: {id: id}});

if(deleted.type == 'channel'){
  const ter = await channel.findAll({where: {id: id}});

  for await (const cartItem2 of ter){
        // Make sure to wait on all your sequelize CRUD calls
        const prod = await channel.findOne({where: {id: cartItem2.id}});

        prod['genre'] = ''; //null the genre as its being deleted
        await prod.save();
    }


}

else if(deleted.type == 'movie'){
    const ter = await movie.findAll({where: {id: id}});
  
  for await (const cartItem2 of ter){
        // Make sure to wait on all your sequelize CRUD calls
        const prod = await movie.findOne({where: {id: cartItem2.id}});

        prod['genre'] = ''; //null the genre as its being deleted
        await prod.save();
    }

}

else if(deleted.type == 'serie'){
    const ter = await serie.findAll({where: {id: id}});
  
  for await (const cartItem2 of ter){
        // Make sure to wait on all your sequelize CRUD calls
        const prod = await serie.findOne({where: {id: cartItem2.id}});

        prod['genre'] = ''; //null the genre as its being deleted
        await prod.save();
    }

}
    res.redirect('/admin/genres');
})



router.get('/admin/genre/delete',middlewares.checkAuth, async (req, res) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/genres');
  }

  const user = await genre.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/genres');
  }

   res.render('genre/del.ejs', { olddata:user });

})






router.get('/admin/genres',middlewares.checkAuth, middlewares.pagination,  async (req, res) => {
   var count, rows;

   const { page, size } = req.pagination;


   if(req.query.search)
   {
     var query = req.query.search;

       if(req.query.type){
    
 var { count, rows } = await genre.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
  where: {
    name:{
    [Op.like]: '%' + query + '%'
    },
    type:req.query.type
  },
    limit: size,
    offset: page * size 
  });

      }else{




 var { count, rows } = await genre.findAndCountAll({
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

      }
 
   }else{
     

            if(req.query.type){

 var { count, rows } = await genre.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
  where: {
    type:req.query.type
  },
    limit: size,
    offset: page * size 
  });


   }else{
  var { count, rows } = await genre.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
    limit: size,
    offset: page * size 
  });

   }

   }

  // console.log(count);
  var totalPages = Math.ceil(count / Number.parseInt(size));

  // res.send({
  //   content: usersWithCount.rows,
  //   totalPages 
  // });

   res.render('genre/show.ejs', { pages: totalPages,currpage: page+1,data:rows });


});







module.exports = router;
