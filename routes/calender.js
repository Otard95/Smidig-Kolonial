
const router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('calendar');
});

module.exports = router;
