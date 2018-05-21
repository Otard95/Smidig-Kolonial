/*jshint esversion: 6 */
/*jshint node: true */

// Helper functions

// Helper functions always needs to take something in
function yell(msg) {
  // And need to return the same value that comes in (and changed if needed)
  return (msg.toUpperCase()) + '!!!';
}

function times(n, block) {
  let out = '';
  for (let i = 0; i < n; i++) {
    out += block.fn(i);
  }
  return out;
}

function month_name(number, hbs_block) {
  switch (number) {
    case 0:
      return hbs_block.fn('JANUAR');
      break;
    case 1:
      return hbs_block.fn('FEBRUAR');
      break;
    case 2:
      return hbs_block.fn('MARS');
      break;
    case 3:
      return hbs_block.fn('APRIL');
      break;
    case 4:
      return hbs_block.fn('MAI');
      break;
    case 5:
      return hbs_block.fn('JUNI');
      break;
    case 6:
      return hbs_block.fn('JULI');
      break;
    case 7:
      return hbs_block.fn('AUGUST');
      break;
    case 8:
      return hbs_block.fn('SEPTEMBER');
      break;
    case 9:
      return hbs_block.fn('OKTOBER');
      break;
    case 10:
      return hbs_block.fn('NOVEMBER');
      break;
    case 11:
      return hbs_block.fn('DESEMBER');
      break;
  }
}

// Prinits out weeks for a month (5 weeks)
// {{#weeks 2018 5}}
function weeks(year, month, hbs_block) {
  let output = ''
  // First day in month
  let date = new Date(year, month, 0)
  date.setHours(0, 0, 0)
  // Make Sunday's day number 7  
  date.setDate(date.getDate() + 4 - (date.getDay() || 7))
  // Get first day of year  
  let firstDay = new Date(date.getFullYear(), 0, 1)
  let num = Math.ceil((((date - firstDay) / 86400000) + 1) / 7)

  for (let i = 0; i < 5; i++) {
    output += hbs_block.fn(num + i)
  }
  return output;
}


// {{#calendar 2018 5}}
function calendar(year, month, hbs_block) {
  let output = ''

  // Dont know why i need to plus the month+1 only on the getDate()
  let daysInMonth = new Date(year, month, 0).getDate()
  let getStartingDayOfMonth = new Date(year, month, 1).getDay()

  // Fills up first inactive datys with empty divs
  if (getStartingDayOfMonth === 0) getStartingDayOfMonth = 7
  for (let i = 1; i < getStartingDayOfMonth; i++) output += hbs_block.fn()

  // Fills up days with numbers
  for (let i = 0; i < daysInMonth; i++) output += hbs_block.fn(i + 1)
  return output;
}

function section(str_name, hbs_options) {

  if (!this._sections) this._sections = {};
  if (!this._sections.head) {
    this._sections[str_name] = hbs_options.fn(this);
  } else {
    this._sections[str_name] += hbs_options.fn(this);
  }
  return null;

}

function progress(num_current, num_max, str_id) {

  if (!this._sections) this._sections = {};
  if (!this._sections.head) {
    this._sections.head = '<link rel="stylesheet" href="/css/progress_bars.css">';
  } else {
    this._sections.head += '<link rel="stylesheet" href="/css/progress_bars.css">';
  }

  out = '<div class="progress-bar-wrapper"' +
    (typeof str_id === 'string' ? ` id="${str_id}">` : '>');
  let cbar = '<div class="bar compleated"></div>';
  let bar = '<div class="bar"></div>';
  let cstage = '<div class="stage compleated"><div></div></div>';
  let custage = '<div class="stage current"><div></div></div>';
  let stage = '<div class="stage"><div></div></div>';

  for (let i = 0; i < num_max; i++) {
    if (i != 0) out += i < num_current ? cbar : bar;
    if (i < num_current - 1) {
      out += cstage;
    } else if (i == num_current - 1) {
      out += custage;
    } else {
      out += stage;
    }
  }

  out += '</div>';

  return out;
}

function selector_group(str_type, str_name, json_choices, str_id) {

  if (!this._sections) this._sections = {};
  if (!this._sections.head) {
    this._sections.head = '<link rel="stylesheet" href="/css/selector_group.css">';
  } else {
    this._sections.head += '<link rel="stylesheet" href="/css/selector_group.css">';
  }

  let arr_choices = JSON.parse(json_choices);

  out = '<div class="selector-group-wrapper"' +
    (typeof str_id === 'string' ? ` id="${str_id}">` : '>');

  for (let i = 0; i < arr_choices.length; i++) {
    out += `<input class="selector-group-input" id="option-${i}" type="${str_type}" name="${str_name}" value="${arr_choices[i].value}">`;
    out += `<label class="selector-group-label" for="option-${i}">${arr_choices[i].label}</label>`;
  }

  out += '</div>';

  return out;

}

module.exports = {
  yell,
  times,
  calendar,
  weeks,
  section,
  progress,
  selector_group,
  month_name
};