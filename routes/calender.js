
const router = require('express').Router();
const url = require('url');
const OAuth = require('../bin/OAuth');
const week = require('./week.js');
const shopping_list_service = require('../bin/shopping-list');

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

/* GET home page. */
router
  .get('/:mon-:day', week) // Gets week 
  .get('/:mon?', function (req, res, next) {

    let res = await GetShoppingListsDates(req.user.lists);
    console.log(res);

    res.render('calendar', {
      title: 'Kalender',
      month: req.params.mon ? req.params.mon : new Date().getMonth()
    });
  })

module.exports = router;