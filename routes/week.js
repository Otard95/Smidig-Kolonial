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
const GroupDocument         = require("../models/group-document");

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

  if (list) {
    list.products.forEach(item => {
      prom.push(api.GetItemById(item.kolonialId));
    });
    let products = await Promise.all(prom);

    list.products.forEach((item, index) => {
      item.data = products[index];
    });
  }
  
  console.log(list);

  // Required  to pass month and day down to render successfully
  let categories = await api.GetAllCategories()
  //let product = await api.GetItemById(520)
  let months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

  let uke_num = getWeekNumber(mon - 1, day)
  let days_arr = getNumbersInWeek(2018, mon - 1, day)

  res.render('week', {
    title: `Calendar: ${day} ${months[mon - 1]}`,
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

    let name = req.body.name || `Klikk for å endre navn på handlelisten.`;
    let sharedWith = req.body.sharedWith || [];

    const shoppinglist = new ShoppingListDocument(
      name,
      encoded_date, 
      [], 
      [],
      sharedWith
    );

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

    list = SLRes.data;

  }

  // ### Update products in list
  if (Array.isArray(req.body.product_update)) {
    // loop through and update all the products
    for (let p of req.body.product_update) {
      // create a ProductDocument with the new data
      let product = new ProductDocument(
        undefined,
        p.amount,
        p.groupId
      );
      
      let response;

      try {
        // try to update the shopping list
        response = await shopping_list_service.updateShoppingList(list.documentId, p.pid, product);
      } catch (e) {
        res.status(500).json({
          code: 103,
          message: 'Det oppstod en feil på våre servere, og vi fikk ikke lagret handlelisten din.'
        });
        return;
      }
      // make sure everythinf is ok
      if (!ShoppingListResponse.OK(response)) {
        res.status(500).json({
          code: 104,
          message: 'Det oppstod en feil på våre servere. Det kan hende at handlelisten ikke ble lagret slik den skulle.'
        });
        return;
      }
    }

  } // END pruduct update

  // ### Add products to list
  if (Array.isArray(req.body.product_add)) {
    // loop through and update all the products
    for (let p of req.body.product_add) {
      // create a ProductDocument with the new data
      let product = new ProductDocument(
        p.kolonialId,
        p.amount,
        p.groupId
      );
      // define a response vaiable
      let response;
      try {
        // try to update the shopping list
        response = await shopping_list_service.addDocumentToList(list.documentId, product);
      } catch (e) {
        res.status(500).json({
          code: 103,
          message: 'Det oppstod en feil på våre servere, og vi fikk ikke lagret handlelisten din.'
        });
        return;
      }
      // make sure everythinf is ok
      if (!ShoppingListResponse.OK(response)) {
        res.status(500).json({
          code: 104,
          message: 'Det oppstod en feil på våre servere. Det kan hende at handlelisten ikke ble lagret slik den skulle.'
        });
        return;
      }
      // push the response to the raw output
      p.pid = response.data.id;
    }

  } // END product add

  if (typeof req.body.group_update === 'object' && !Array.isArray(req.body.group_update)) {

    let group = new GroupDocument(
      req.body.group_update.color,
      req.body.group_update.name,
      req.body.group_update.id
    );

    let response;

    try {
      response = await shopping_list_service.updateShoppingList(list.documentId, group.documentId, group);
    } catch (e) {
      res.status(500).json({
        code: 103,
        message: 'Det oppstod en feil på våre servere, og vi fikk ikke oppdatert kategorien din.'
      });
      return;
    }

    if (!ShoppingListResponse.OK(response)) {
      res.status(500).json({
        code: 104,
        message: 'Det oppstod en feil på våre servere. Det kan hende at kategorien ikke ble lagret slik den skulle.'
      });
      return;
    }
  } // END group update

  if (typeof req.body.group_create === 'object' && !Array.isArray(req.body.group_create)) {
    
    let group = new GroupDocument(
      req.body.group_create.color,
      req.body.group_create.name,
    );

    let response;

    try {
      response = await shopping_list_service.addDocumentToList(list.documentId, group);

    } catch (e) {
      res.status(500).json({
        code: 103,
        message: 'Det oppstod en feil på våre servere, og vi fikk ikke opprettet kategorien din.'
      });
      return;
    }

     if (!ShoppingListResponse.OK(response)) {
       res.status(500).json({
         code: 104,
         message: 'Det oppstod en feil på våre servere. Det kan hende at kategorien ikke ble lagret slik den skulle.'
       });
       return;
     }

  } // END group create

  if (typeof req.body.group_delete === 'object' && !Array.isArray(req.body.group_delete)) {
    

    try {
      await shopping_list_service.deleteGroup(list.documentId, req.body.group_delete.groupId);
    } catch (e) {
      res.status(500).json({
        code: 103,
        message: 'Det oppstod en feil på våre servere, og vi fikk ikke slettet kategorien din.'
      });
      return;
    }
  } // END delete group

  if (typeof req.body.group_add === 'object' && !Array.isArray(req.body.group_add)) {

    let response;

    try {
      response = await shopping_list_service.addGroupToProduct(
        list.documentId, 
        req.body.group_add.productId, 
        req.body.group_add.groupId
      );
    } catch (e) {
      res.status(500).json({
        code: 103,
        message: 'Det oppstod en feil på våre servere, og vi fikk ikke tilegnet produktet din kategori.'
      });
      return;
    }

     if (!ShoppingListResponse.OK(response)) {
       res.status(500).json({
         code: 104,
         message: 'Det oppstod en feil på våre servere. Det kan hende at kategorien ikke ble lagret til produktet slik den skulle.'
       });
       return;
     }
  } // END add group to product

  if (typeof req.body.group_remove === 'object' && !Array.isArray(req.body.group_remove)) {

    let response;

    try {
      response = await shopping_list_service.removeGroupFromProduct(list.documentId, req.body.group_remove.productId);
    } catch (e) {
      res.status(500).json({
        code: 103,
        message: 'Det oppstod en feil på våre servere, og vi fikk ikke fjernet kategorien fra produktet.'
      });
      return;
    }

    if (!ShoppingListResponse.OK(response)) {
      res.status(500).json({
        code: 104,
        message: 'Det oppstod en feil på våre servere. Det kan hende at kategorien ikke ble fjernet fra produktet slik den skulle.'
      });
      return;
    }
  } // END remove group from product

  if (typeof req.body.meta_update === 'object' && !Array.isArray(req.body.meta_update)) {

    if (!Array.isArray(req.body.meta_update.sharedWith)){
      res.status(500).json({
        code: 105,
        message: 'Det oppstod en feil på våre servere. Det kan hende at endringene i listen ikke ble lagret slik de skulle.'
      });
      return;
    }
    
    let listObj = new ShoppingListDocument(
      req.body.meta_update.name,
      undefined,
      undefined,
      undefined,
      req.body.meta_update.sharedWith
    );

    let response;

    try {
      response = await shopping_list_service.updateShoppingList(list.documentId, listObj);
    } catch (e) {
      res.status(500).json({
        code: 103,
        message: 'Det oppstod en feil på våre servere, og vi fikk ikke oppdatert listen din.'
      });
      return;
    }

    if (!ShoppingListResponse.OK(response)) {
      res.status(500).json({
        code: 104,
        message: 'Det oppstod en feil på våre servere. Det kan hende at endringene i listen ikke ble lagret slik de skulle.'
      });
      return;
    }

    
  } // END update meta

  res.json({
    code: 0,
    message: 'Handlelisten ble lagret',
    updated: {
      products: req.body.product_update,
      groups: req.body.group_update,
      meta: req.body.meta_update,
      group: req.body.group_add
    },
    created: {
      products: req.body.product_add,
      groups: req.body.group_create,
    },
    deleted: {
      group: req.body.group_delete,
      group_in_product: req.body.group_remove
    }
  });

});

router.get('/render/:partial_name', async (req, res, next) => {

  let data = { layout: false };

  if (req.params.partial_name == 'product-item' && req.query.kolonialId) {
    let id = parseInt(req.query.kolonialId);
    let response = await api.GetItemById(id);
    data.product = response;
  }

  // Get 
  if (req.params.partial_name == 'product-list-item' &&
      req.query.kolonialId &&
      req.query.pid)
  {

    data.documentId = req.query.pid;

    let response = await api.GetItemById(req.query.kolonialId);
    data.data = response;

  }

  res.render(`partials/${req.params.partial_name}`, data);

});

module.exports = router;