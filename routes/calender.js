/*jshint esversion: 6 */
/*jshint node: true */

const express = require('express');
const week = require('./week.js');
const router = express.Router();

/* GET home page. */
router
  .get('/:mon-:day', week) // Gets week 
  .get('/:mon?', function (req, res, next) {
    res.render('calendar', {
      title: 'Kalender',
      month: req.params.mon ? req.params.mon : new Date().getMonth()
    });
  })

module.exports = router;