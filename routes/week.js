
const router = require('express').Router();

/* GET home page. */
router.get('/:mon-:day', (req, res, next) => {

  let mon = req.params.mon
  let day = req.params.day

  // Required  to pass month down to render
  let chosen_day = day
  let month = new Date(2018, mon, day).getMonth()
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
    // date = new Date(year, month - 1, daynum);
    while (arr.length < 7) {
      let date = new Date(year, month, daynum)
      // Difference checks if first days in week is negative (in to last month)
      let differance = date.getDate() - day + (day == 0 ? -6 : arr.length + 1)
      // If diff is < 1, starts from month before
      if (differance < 1) {
        arr.push(new Date(year, month - 1, differance).getDate())
      } else {
        let monthlength = new Date(year, month, 0).getDate() + 1
        let thisdate = date.getDate() - day + (day == 0 ? -6 : arr.length + 1)
        // checks if date is over the month length
        thisdate > monthlength ? arr.push(thisdate - monthlength) : arr.push(thisdate)
      }
    }
    return arr
  }

  let uke_num = getWeekNumber(mon, day)
  let days_arr = getNumbersInWeek(2018, mon, day)

  res.render('week', {
    title: `Calendar: ${day} ${months[month]}`,
    month,
    uke_num,
    daysstring: ['Man', 'Tis', 'Ons', 'Tor', 'Fre', 'Lor', 'Son'],
    days_arr,
    chosen_day
  });
});

module.exports = router;