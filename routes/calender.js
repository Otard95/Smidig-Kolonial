const express = require('express');
const router = express.Router()

const url = require('url');
const OAuth = require('../bin/OAuth');
const week = require('./week.js');
const shopping_list_service = require('../bin/shopping-list');
const ShoppingListResponse = require('../models/shopping-list-response');

async function GetShoppingListsDates (arr_list) {

  prom = [];
  arr_list.forEach( id => {
    prom.push(shopping_list_service.getShoppingList(id));
  });
  let res = await Promise.all(prom);

  res = res.filter(SLRes => ShoppingListResponse.OK(SLRes));
  res = res.map(SLRes => SLRes.data.date);

  return res;

}

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
  .get('/:mon?', async (req, res, next) => {

    let test = await GetShoppingListsDates (req.user.lists);
    console.log(test);

    let mon = req.params.mon
    res.render('calendar', {
      title: 'Kalender',
      month: mon ? mon : new Date().getMonth() + 1
    });
  })

module.exports = router;