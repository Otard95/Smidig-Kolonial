const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('uke', {
    title: 'Uke',
    uke: '49',
    daysstring: ['Man','Tis','Ons','Tor','Fre','Lor','Son'],
    daysnum: ['7','8','9','10','11','12','13']
  });
});

module.exports = router;
