var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:name', function(req, res, next) {
  res.render('chat', { name: req.params.name });
});

module.exports = router;
