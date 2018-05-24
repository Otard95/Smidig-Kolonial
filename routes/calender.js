
const router = require('express').Router();
const week = require('./week.js');

/* GET home page. */
router
  .get('/:mon-:day', week) // Gets week 
  .get('/:mon?', function (req, res, next) {

    let mon = req.params.mon

    res.render('calendar', {
      title: 'Kalender',
      month: mon ? mon : new Date().getMonth()+1
    });
  })

module.exports = router;