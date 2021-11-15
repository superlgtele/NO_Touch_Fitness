const express = require('express');
const router = express.Router();

router.get('/onlinept', function(req, res){
    res.render('home/onlinept');
  });

module.exports = router;