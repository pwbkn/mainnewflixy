const express = require('express');
const router = express.Router();
const middlewares = require('./middlewares');
const User = require('./models/User');
const { body, validationResult } = require('express-validator');

const jwt = require("jsonwebtoken");
const sercet = 'flixyisjustgreat';

router.use('/', require('./routers/MovieRouter'));
router.use('/', require('./tmdb'));



//router.get('/', async (req, res,next) => {
//   const users = await User.findAll();
//   res.send(users);
//  next(new middlewares.Running());
// })




router.post("/login", 
body('username')
  .notEmpty().withMessage('Username cannot be empty')
  .bail(),
  body('password')
  .notEmpty().withMessage('Password cannot be empty')
  .bail()
  //   .custom(async (username) => {
  //   const user = await UserService.findByEmail(email)
  //   if(user){
  //     throw new Error('Email in use');
  //   }
  // })
,
  (req, res,next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(new middlewares.CustomExpection(errors.array()));
  }

  const {username,password} = req.body;

  if(username === 'admin' && password === 'anu123456'){
  const token = jwt.sign({ name:'dev' }, sercet, { expiresIn: '1h' })

      res.cookie('token',token, { maxAge: 3600000, httpOnly: true });
       // res.send({
  //  token: token
 // })
 res.redirect('/');
     console.log('cookie created successfully');
     
  }else{
    next(new middlewares.InvalidToken());
  }

})




// router.post('/users', async (req, res,next) => {
//   await User.create(req.body);
//   next(new middlewares.Inserted());
// })

// router.get('/users', middlewares.pagination, async (req, res) => {
//    const { page, size } = req.pagination;
//   const usersWithCount = await User.findAndCountAll({
//       order: [

//     ['createdAt', 'DESC']
//       ],
//     limit: size,
//     offset:  page * size 
//   });

//   res.send({
//     content: usersWithCount.rows,
//     totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size))
//   });


// });



router.get('/ping', (req,res)=>{
  res.send('pong');
})

router.use((err, req, res, next) => {
  res
    .status(err.status||500)
    .send(
      {
        message: err.message,
        success:err.s,
        timestamp: Date.now(),
        path: req.originalUrl
      });
})


router.use('/', require('./routers/AdminMovieRouter'));
router.use('/', require('./routers/AdminKodiRouter'));
router.use('/', require('./routers/AdminGenreRouter'));
router.use('/', require('./routers/AdminChannelRouter'));
router.use('/', require('./routers/AdminSerieController'));



router.get('/login', async (req, res) => {
 // console.log('Cookies: ', req.cookies);
  // res.send('');
    // res.render('login.ejs', { error: 'nonde' });
    res.render('login.ejs');
});

router.get('/logout', (req, res) => {
  //console.log('Cookies: ', req.cookies);
  // res.send('');
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.redirect('/');
});

router.get('/', middlewares.checkAuth,
async (req, res,next) => {
  // const users = await User.findAll();
  // res.send(users);
 // next(new middlewares.Running());
  res.render('index.ejs');
}
);

module.exports = router;