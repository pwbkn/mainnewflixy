const channel = require('../models/Channel');
const Source = require('../models/Source');
const Genre = require('../models/Genre');
const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');
const { body, validationResult } = require('express-validator');
const { Op } = require("sequelize");


router.post('/admin/channels/create', middlewares.checkAuth,async (req, res,next) => {

  var data = req.body;

// console.log(req.body);

 if(data.genrename){
  const genre = await Genre.findOne({where: {name:  data.genrename,type:"channel"}});

  if(!genre){
 const jane = await Genre.create({ name: data.genrename,type:"channel" });
 data["genre"] = jane.id;

  }else{
     data["genre"] = genre.id;

  }

 }

 

  var mo =  await channel.create(data);

  //  res.render('channel/editchannel.ejs',{ olddata:mo });
  res.redirect('/admin/channel/sources?id='+mo.id)
})


router.get('/admin/channels/create', middlewares.checkAuth, async (req, res,next) => {
   res.render('channel/createchannel.ejs');
})

// router.get('/admin/channels/addsrc', middlewares.checkAuth, async (req, res,next) => {
//    res.render('channel/addsrc.ejs');
// })




router.post('/admin/channel/edit/:id',middlewares.checkAuth,async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
  }
  const user = await channel.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
  }
  // console.log(req.body);
  // console.log(   Array.from(req.body)
// );
  Object.entries(req.body).forEach((e,i)=>{
    user[e[0]] = e[1];
  });
  await user.save();
    res.redirect('/admin/channel/edit?id='+id);
})

router.get('/admin/channel/edit',middlewares.checkAuth, async (req, res,next) => {
  const id = Number.parseInt(req.query.id);
  var error;
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
   }

  var  user = await channel.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
  }

   res.render('channel/editchannel.ejs', { olddata:user });
})


router.get('/admin/channel/delete/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
  }
  const user = await channel.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
  }

  await channel.destroy({where: {id: id}});
  await Source.destroy({where: {channel_id: id}});

    res.redirect('/admin/channels');
})



router.get('/admin/channel/delete',middlewares.checkAuth, async (req, res) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
  }
  const user = await channel.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
  }

   res.render('channel/deletechannel.ejs', { olddata:user });

})



router.get('/admin/channel/sources',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
  }
  const user = await channel.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
  }

 const {count,rows} =  await Source.findAndCountAll({where: {channel_id: id}});

   res.render('channel/sources.ejs', { olddata:user,data:rows,noofsrc:count });
})









router.get('/admin/channels',middlewares.checkAuth, middlewares.pagination,  async (req, res) => {
   var count, rows;

   const { page, size } = req.pagination;


   if(req.query.search)
   {
     var query = req.query.search;
 var { count, rows } = await channel.findAndCountAll({
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
     
 var { count, rows } = await channel.findAndCountAll({
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

   res.render('channel.ejs', { pages: totalPages,currpage: page+1,data:rows });


});












//sources 


router.get('/admin/channel/addsrc',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
  }
  const user = await channel.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
  }

   res.render('channel/addsrc.ejs', { data:user});
})



router.post('/admin/channel/addsrc', middlewares.checkAuth,async (req, res,next) => {

  var data = req.body;
  var id = req.query.id;

  data['channel_id'] = id;

// console.log(req.body);
  var mo =  await Source.create(data);

  //  res.render('channel/editchannel.ejs',{ olddata:mo });
  res.redirect('/admin/channel/sources?id='+id)
})





router.get('/admin/channel/delsrc/:id',middlewares.checkAuth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
  }
  const user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
  }

  await Source.destroy({where: {id: id}});

    res.redirect('/admin/channel/sources?id='+user.channel_id);
})


router.get('/admin/channel/delsrc',middlewares.checkAuth, async (req, res) => {

  const id = Number.parseInt(req.query.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
  }
  const user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
  }

   res.render('channel/delsrc.ejs', { olddata:user });

})


router.post('/admin/channel/editsrc/:id',middlewares.checkAuth,async (req, res) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
  }

  const user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
    console.log('not found');
  }
  // console.log(req.body);
  // console.log(   Array.from(req.body)
// );
  Object.entries(req.body).forEach((e,i)=>{
    user[e[0]] = e[1];
  });

  await user.save();

    res.redirect('/admin/channel/sources?id='+user["channel_id"]);
})

router.get('/admin/channel/editsrc',middlewares.checkAuth, async (req, res,next) => {
  const id = Number.parseInt(req.query.id);
  var error;
  if (Number.isNaN(id)) {
    res.redirect('/admin/channels');
   }

  var  user = await Source.findOne({where: {id: id}});
    if(!user) {
    res.redirect('/admin/channels');
  }

  var  user1 = await channel.findOne({where: {id: user["channel_id"]}});

    if(!user1) {
    res.redirect('/admin/channels');
  }


   res.render('channel/editsrc.ejs', { oldsrc:user,olddata:user1 });
})


//sources 


module.exports = router;
