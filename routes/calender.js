/*jshint esversion: 6 */
/*jshint node: true */

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/:mon?', async function (req, res, next) {
  let month = req.params.mon ? req.params.mon : new Date().getMonth();

  res.render('calendar', {
    title: 'Kalender',
    month
  });
});

module.exports = router;