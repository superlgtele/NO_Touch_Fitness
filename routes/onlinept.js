const express = require('express');
const router = express.Router();

router.get('/onlinept', function(req, res){
    res.render('another/first');
  });

module.exports = router;