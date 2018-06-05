const router = require('express').Router();

// API payload
const key                   = require('./../configs/tokens.json');
const interface             = require('kolonial_api_wrapper');
const api                   = new interface(key.kolonial.user_agent, key.kolonial.token);
const url                   = require('url');
const shopping_list_service = require('../bin/shopping-list');
const ShoppingListResponse  = require('../models/shopping-list-response');
const ShoppingListDocument  = require('../models/shopping-list-document');
const ProductDocument       = require('../models/product-document');

function checkInt (val) {
  
  let int = parseInt(val);

  if (int === NaN || '' + int !== val) {
    return;
  }

  return int;

}

async function GetListOnDate (num_date, arr_list_ids) {

  if (!num_date) return false;

  prom = [];
  arr_list_ids.forEach( id => {
    prom.push(shopping_list_service.getShoppingListContent(id));
  });
  let res = await Promise.all(prom);

  res = res.filter( SLRes => ShoppingListResponse.OK(SLRes) );
  res = res.map( SLRes => SLRes.data );
  res = res.filter( ListDoc => ListDoc.date === num_date );

  return res;

}

function getWeekNumber(month, day) {
  date = new Date(Date.UTC(2018, month, day));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function getNumbersInWeek(year, month, daynum) {
  let arr = []
  let date = new Date(year, month, daynum);
  let week_day = date.getDay() - 1;

  // get the date og the first day of the week
  let first_date = date.getDate() - (week_day == -1 ? 6 : week_day);
  let mon_len = new Date(year, month + 1, 0).getDate();

  if (first_date < 1) {
    // Lengthog the month the week start in 
    mon_len = new Date(year, month, 0).getDate();
    first_date = mon_len + first_date;
  }

  for (let i = 0; i < 7; i++) {
    let temp = (first_date + i) % (mon_len + 1);
    temp += (temp < first_date ? 1 : 0);
    arr.push(temp);
  }
  return arr
}

/* GET home page. */
router.get('/:mon-:day', async (req, res, next) => {

  let mon = checkInt(req.params.mon);
  let day = checkInt(req.params.day);
  
  if (mon === undefined || day === undefined) {
    next({
      msg: 'parameter error'
    });
    return;
  }

  let encoded_date = 201800;
  encoded_date += mon; encoded_date *= 100;
  encoded_date += day;
  
  let list = await GetListOnDate(encoded_date, req.user.lists);
  list = list[0];

  let prom = [];
  list.products.forEach(item => {
    prom.push(api.GetItemById(item.kolonialId));
  });
  let products = await Promise.all(prom);

  list.products.forEach((item, index) => {
    item.data = products[index];
  });
  
  console.log(list);

  // Required  to pass month and day down to render successfully
  let categories = await api.GetAllCategories()
  //let product = await api.GetItemById(520)
  let months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

  let uke_num = getWeekNumber(mon - 1, day)
  let days_arr = getNumbersInWeek(2018, mon - 1, day)

  res.render('week', {
    title: `Calendar: ${day} ${months[mon]}`,
    month: mon,
    uke_num,
    daysstring: ['Man', 'Tis', 'Ons', 'Tor', 'Fre', 'Lor', 'Son'],
    days_arr,
    chosen_day: day,
    categories,
    list
  })
});

router.get('/:mon-:day/create', async (req, res, next) => {

  let mon = checkInt(req.params.mon);
  let day = checkInt(req.params.day);

  if (mon === undefined || day === undefined) {
    next({
      msg: 'parameter error'
    });
    return;
  }

  let encoded_date = 201800;
  encoded_date += mon; encoded_date *= 100;
  encoded_date += day;

  let list = await GetListOnDate(encoded_date, req.user.lists);
  list = list[0];

  if (list) {
    res.status(400);
    res.json({
      code: 100,
      message: 'Oops. Det finnes allere en liste på denne datoen.'
    })
    return;
  }

  let name = req.body.name || `Klikk for å endre navn på handlelisten.`;
  let sharedWith = req.body.sharedWith || [];

  const shoppinglist = new ShoppingListDocument(
    name,
    encoded_date,
    [],
    [],
    sharedWith
  )

  let SLRes;
  try {
    SLRes = await shopping_list_service.createShoppingList(req.user.id, shoppinglist);
  } catch (e) {
    res.status(500);
    res.json({
      code: 101,
      message: 'Oops. Vi klarte ikke opprette din handleliste. Du kan prøve på nytt. On problemet oppstår igjen ta kontakt med oss.',
      err: e
    })
    return;
  }

  if (!ShoppingListResponse.OK(SLRes)) {
    res.status(500);
    res.json({
      code: 101,
      message: 'Oops. Vi klarte ikke opprette din handleliste. Du kan prøve på nytt. On problemet oppstår igjen ta kontakt med oss.',
      err: SLRes
    })
    return;
  }

  res.status(200);
  res.json(SLRes.data);

});

router.post('/:mon-:day/update', async (req, res, next) => {

  let mon = checkInt(req.params.mon);
  let day = checkInt(req.params.day);

  if (mon === undefined || day === undefined) {
    next({
      msg: 'parameter error'
    });
    return;
  }

  let encoded_date = 201800;
  encoded_date += mon; encoded_date *= 100;
  encoded_date += day;

  let list = await GetListOnDate(encoded_date, req.user.lists);
  list = list[0];

  if (!list) {
    res.status(400);
    res.json({
      code: 102,
      message: 'Oops. Det er ingen liste på denne datoen.'
    })
    return;
  }

  if (req.body.product_update) {
    for (let p of req.body.product_update) {
      let product = new ProductDocument(
        undefined,
        p.amount,
        undefined
      );
      let response;
      try {
        response = await shopping_list_service.updateShoppingList(list.documentId, p.pid, product);
      } catch (e) {
        res.status(500).json({
          code: 103,
          message: 'Det oppstod en feil på våre servere, og vi fikk ikke lagret handlelisten din.'
        });
        return;
      }
      if (!ShoppingListResponse.OK(response)) {
        res.status(500).json({
          code: 104,
          message: 'Det oppstod en feil på våre servere. Det kan hende at handlelisten ikke ble lagret slik den skulle.'
        });
        return;
      }
    }
  }

  if (req.body.group_update) {
    // TODO: implement
  }

  if (req.body.meta_update) {
    // TODO: implement
  }

  res.json({
    code: 0,
    message: 'Handlelisten ble lagret',
    updated: {
      products: req.body.product_update,
      groups: req.body.group_update,
      meta: req.body.meta_update
    }
  });

});

module.exports = router;