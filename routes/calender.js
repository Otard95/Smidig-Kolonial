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

async function GetAllShoppingLists(listIds) { 
  
  if (listIds.length === 0) {
    return [];
  }

  prom = [];

  listIds.forEach(id => {
    prom.push(shopping_list_service.getShoppingList(id));
  });

  let allLists = await Promise.all(prom);

  allLists = allLists.filter(SLRes => ShoppingListResponse.OK(SLRes));

  return allLists.map(SLres => SLres.data);

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

  let prom = [];
  allLists.forEach(e => {
    let p = new Promise((resolve, reject) => {
      res.render('partials/shopping-list-mini-block', e, (err, html) => {
        if (err) {
          resolve('');
          console.log(err);
          return;
        }
        resolve(html);
      });
    });
    prom.push(p);
  });
  let response = await Promise.all(prom);

  res.status(200).send(response.join());

});

router.get('/:mon?', async (req, res, next) => {

  let shoppinglistdates = await GetShoppingListsDates (req.user.lists);

  let mon = req.params.mon
  res.render('calendar', {
    title: 'Kalender',
    month: mon ? mon : new Date().getMonth() + 1,
    shoppinglistdates
  });
});

module.exports = router;