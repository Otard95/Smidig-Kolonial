const express = require('express');
const router = express.Router()

const url = require('url');
const OAuth = require('../bin/OAuth');
const week = require('./week.js');
const shopping_list_service = require('../bin/shopping-list');
const ShoppingListResponse = require('../models/shopping-list-response');

Number.prototype.clamp = (a, b) => {return Math.min(Math.max(this, min), max)};

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

async function GetAllShoppingLists(listIds) { 
  
  if (listIds.length === 0) {
    return [];
  }

  prom = [];

  listIds.forEach(id => {
    prom.push(shopping_list_service.getShoppingList(id));
  });

  let allLists;
  try {
    allLists = await Promise.all(prom);
  } catch(err) {
    console.log(err);
  }

  allLists = allLists.filter(SLRes => ShoppingListResponse.OK(SLRes));

  return allLists.map(SLRes => SLRes.data);

}

function SortShoppingLists(allLists) {
    let encoded_date = 201800;
    encoded_date += new Date().getMonth() + 1;
    encoded_date *= 100;
    encoded_date += new Date().getDate();

    let upcommingLists = allLists.filter(list => list.date > encoded_date);
    let passedLists = allLists.filter(list => list.date < encoded_date);

    upcommingLists.sort((a, b) => {
      let num = (a.date - b.date);
      return Math.min(Math.max(num, -1), 1);
    });

    passedLists.sort((a, b) => {
      let num = (b.date - a.date);
      return Math.min(Math.max(num, -1), 1);
    });

    return {
      upcoming: upcommingLists,
      passed: passedLists
    }
}

router.use('/', OAuth.Authorized(url.format({ // /user/login?redirect=<redirect-uri>&m=<message>
  pathname: '/user/login',
  query: {
    redirect: '/kalender',
    m: 'Du må være logget inn for å bruke den siden.'
  }
})));

router.use('/liste', week);

router.get('/lists-overview', async (req, res, next) => {

  let listIds = req.user.lists;

  console.log(listIds);

  let allLists = await GetAllShoppingLists(listIds);

  res.render('partials/shoping-lists-panel', SortShoppingLists(allLists));

});

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


module.exports = router;