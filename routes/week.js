
const router = require('express').Router();

/* GET home page. */
router.get('/:mon-:day', (req, res, next) => {

  let mon = parseInt(req.params.mon);
  let day = parseInt(req.params.day);

  if (mon === NaN || '' + mon !== req.params.mon ||
      day === NaN || '' + day !== req.params.day)
  {
    next({
      msg: 'parameter error'
    });
    return;
  }

  // Required  to pass month down to render
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

    // // date = new Date(year, month - 1, daynum);
    // while (arr.length < 7) {
    //   let date = new Date(year, month, daynum)
    //   // Difference checks if first days in week is negative (in to last month)
    //   let differance = date.getDate() - day + (day == 0 ? -6 : arr.length + 1)
    //   // If diff is < 1, starts from month before
    //   if (differance < 1) {
    //     arr.push(new Date(year, month - 1, differance).getDate())
    //   } else {
    //     let monthlength = new Date(year, month, 0).getDate() + 1
    //     let thisdate = date.getDate() - day + (day == 0 ? -6 : arr.length + 1)
    //     // checks if date is over the month length
    //     thisdate > monthlength ? arr.push(thisdate - monthlength) : arr.push(thisdate)
    //   }
    // }

    return arr
  }

  let uke_num = getWeekNumber(mon-1, day)
  let days_arr = getNumbersInWeek(2018, mon-1, day)

  res.render('week', {
    title: `Calendar: ${day} ${months[mon]}`,
    month: mon,
    uke_num,
    daysstring: ['Man', 'Tis', 'Ons', 'Tor', 'Fre', 'Lor', 'Son'],
    days_arr,
    chosen_day: day
  });
});

module.exports = router;