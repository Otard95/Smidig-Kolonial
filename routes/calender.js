/*jshint esversion: 6 */
/*jshint node: true */

const express = require('express');
const router = express.Router();
const week = require('./week.js');

/* GET home page. */
router
  .get('/:mon-:day', week)
  .get('/:mon?', async function (req, res, next) {
    let month = req.params.mon ? req.params.mon : new Date().getMonth();
  
    res.render('calendar', {
      title: 'Kalender',
      month
    });
  })

router.get

module.exports = router;