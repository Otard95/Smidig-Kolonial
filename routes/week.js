const router = require('express').Router();

// API payload
const key = require('./../configs/tokens.json');
const interface = require('kolonial_api_wrapper');
const api = new interface(key.kolonial.user_agent, key.kolonial.token);
const shopping_list_service = require('../bin/shopping-list');

async function GetListOnDate (num_date, arr_list_ids) {

  if (!num_date) return false;

  prom = [];
  arr_list_ids.forEach( id => {
    prom.push(shopping_list_service.getShoppingList(id));
  });
  let res = await Promise.all(prom);

  res.filter( ListDoc => ListDoc.date === num_date );

  return res;

}

/* GET home page. */
router.get('/:mon-:day', async (req, res, next) => {
  let mon = parseInt(req.params.mon);
  let day = parseInt(req.params.day);

  if (mon === NaN || '' + mon !== req.params.mon ||
    day === NaN || '' + day !== req.params.day) {
    next({
      msg: 'parameter error'
    });
    return;
  }

  let test = await GetListOnDate(123, req.user.lists);
  console.log(test);

  // Required  to pass month and day down to render successfully
  let categories = await api.GetAllCategories()
  let product = await api.GetItemById(520)
  let months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

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
    product,
  })
})

module.exports = router;