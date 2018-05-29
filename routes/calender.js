const express = require('express');
const router = express.Router()

// API payload
const key = require('./../configs/tokens.json');
const interface = require('kolonial_api_wrapper');
const api = new interface(key.kolonial.user_agent, key.kolonial.token);

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

router

  // ############
  // SOK
  // ############

  .get('/sok', async (req, res, next) => {
    let categories = await api.GetAllCategories()

    res.render('sok', {
      title: 'Sok',
      categories
    })
  })

  // ############
  // WEEK VIEW
  // ############

  .get('/:mon-:day', (req, res, next) => {
    let mon = parseInt(req.params.mon)
    let day = parseInt(req.params.day)

    // Required  to pass month and day down to render successfully
    let chosen_day = day
    let month = new Date(2018, mon + 1, day).getMonth()-1
    let months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

    function getWeekNumber(month, day) {
      date = new Date(Date.UTC(2018, month, day));
      date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
      let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
      return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    }

    function getNumbersInWeek(year, month, daynum) {
      let arr = []
      let day = new Date(year, month, daynum).getDay()
      while (arr.length < 7) {
        let date = new Date(year, month, daynum)
        // Difference checks if first days in week is negative (in to last month)
        let differance = date.getDate() - day + (day == 0 ? -6 : arr.length + 1)
        // If diff is < 1, starts from month before
        if (differance < 1) {
          arr.push(new Date(year, month - 1, differance).getDate())
        } else {
          let monthlength = new Date(year, month - 1, 0).getDate() + 1
          let thisdate = date.getDate() - day + (day == 0 ? -6 : arr.length + 1)
          // checks if date is over the month length
          if (thisdate > monthlength) {
            arr.push(thisdate - monthlength)
          } else {
            arr.push(thisdate)
          }
        }
      }
      return arr
    }

    let uke_num = getWeekNumber(mon, day), days_arr = getNumbersInWeek(2018, mon, day)

    res.render('week', {
      title: `Calendar: ${day} ${months[month]}`,
      month,
      uke_num,
      daysstring: ['Man', 'Tis', 'Ons', 'Tor', 'Fre', 'Lor', 'Son'],
      days_arr,
      chosen_day
    })
  })

  // ############
  // KALENDER VIEW
  // ############

  .get('/:mon?', function (req, res, next) {
    let mon = req.params.mon
    res.render('calendar', {
      title: 'Kalender',
      month: mon ? mon : new Date().getMonth() + 1
    });
  })

module.exports = router;