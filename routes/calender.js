
const router = require('express').Router();
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