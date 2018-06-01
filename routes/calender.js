const express = require('express');
const router = express.Router()

const url = require('url');
const OAuth = require('../bin/OAuth');
const week = require('./week.js');
const shopping_list_service = require('../bin/shopping-list');
const ShoppingListResponse = require('../models/shopping-list-response');

function checkInt (val) {
  
  let int = parseInt(val);

  if (int === NaN || '' + int !== val) {
    return;
  }

  return int;

}

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

router.use('/liste', week);

router.get('/:mon?', async (req, res, next) => {

  let mon = req.params.mon ? checkInt(req.params.mon) : new Date().getMonth() + 1;
  
  if (mon === undefined) {
    next({
      msg: 'parameter error'
    });
    return;
  }

    let shoppinglistdates = await GetShoppingListsDates (req.user.lists);
    console.log(shoppinglistdates)
    res.render('calendar', {
      title: 'Kalender',
      month: mon,
      shoppinglistdates,
      today: 20
    });
  });


router.get('/lists-overview', async (req, res, next) => {

  let listIds = req.user.lists;

  console.log(listIds);

  if (listIds.length > 0) {

    prom = [];

    listIds.forEach(id => {
      prom.push(shopping_list_service.getShoppng(id));
    });

    let allLists = await Promise.all(prom);

    allLists = allLists.filter(SLRes => ShoppingListResponse.OK(SLRes));

    console.log(allLists);

  }



})

module.exports = router;