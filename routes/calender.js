const express = require('express');
const router = express.Router()

const url = require('url');
const OAuth = require('../bin/OAuth');
const week = require('./week.js');

router.use('/', OAuth.Authorized(url.format({ // /user/login?redirect=<redirect-uri>&m=<message>
  pathname: '/user/login',
  query: {
    redirect: '/kalender',
    m: 'Du må være logget inn for å bruke den siden.'
  }
})));

router
  // ############
  // WEEK VIEW
  // ############
  .get('/:mon-:day', week)

  // ############
  // KALENDER VIEW / MAIN ENTRY POINT
  // ############
  .get('/:mon?', function (req, res, next) {
    let mon = req.params.mon
    res.render('calendar', {
      title: 'Kalender',
      month: mon ? mon : new Date().getMonth() + 1
    });
  })

module.exports = router;