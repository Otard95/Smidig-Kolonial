
const router = require('express').Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('week', {
    title: 'Uke',
    uke: '49',
    daysstring: ['Man','Tis','Ons','Tor','Fre','Lor','Son'],
    daysnum: ['7','8','9','10','11','12','13']
  });
});

module.exports = router;
