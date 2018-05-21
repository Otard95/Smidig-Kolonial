/*jshint esversion: 6 */
/*jshint node: true */

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {

  let month = new Date().getMonth();

  res.render('calendar', {
    title: 'Kalender',
    month
  });
});

module.exports = router;