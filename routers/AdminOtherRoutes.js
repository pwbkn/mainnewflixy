const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');
const { body, validationResult } = require('express-validator');


router.get('/maincss', async (req, res) => {
   const { page, size } = req.pagination;
  const usersWithCount = await Movie.findAndCountAll({
      order: [
    ['createdAt', 'DESC'],
  ],
    limit: size,
    offset: page * size 
  });

  res.send({
    content: usersWithCount.rows,
    totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size))
  });


});


module.exports = router;
