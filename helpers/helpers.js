/*jshint esversion: 6 */
/*jshint node: true */

// Helper functions
module.exports = {
  // Helper functions always needs to take something in
  increment(num) {
    // And need to return the same value that comes in (and changed if needed)
    return parseInt(num) + 1;
  },

  condition(v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  },

  times(n, block) {
    let out = '';
    for (let i = 0; i < n; i++) {
      out += block.fn(i);
    }
    return out;
  },

  month_name(number, hbs_block) {
    let months = ['JANUAR', 'FEBRUAR', 'MARS', 'APRIL', 'MAI', 'JUNI', 'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']
    return hbs_block.fn(months[number - 1])
  },

  // Prinits out weeks for a month (5 weeks)
  // {{#weeks 2018 5}}
  weeks(year, month, hbs_block) {
    let output = ''
    // First day in month
    let date = new Date(year, month - 1, 0)
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
  },


  // {{#calendar 2018 5}}
  calendar(year, month, hbs_block) {
    let output = ''

    // Dont know why i need to plus the month+1 only on the getDate()
    let daysInMonth = new Date(year, month, 0).getDate()
    let getStartingDayOfMonth = new Date(year, month - 1, 1).getDay()

    // Fills up first inactive datys with empty divs
    if (getStartingDayOfMonth === 0) getStartingDayOfMonth = 7
    for (let i = 1; i < getStartingDayOfMonth; i++) output += hbs_block.fn()

    let date = 201800;
    date += month; date *= 100;

    // Fills up days with numbers
    for (let i = 0; i < daysInMonth; i++) output += hbs_block.fn({ day: (i + 1), date: date + i + 1 });
    return output;
  },

  section(str_name, hbs_options) {

    if (!this._sections) this._sections = {};
    if (!this._sections.head) {
      this._sections[str_name] = hbs_options.fn(this);
    } else {
      this._sections[str_name] += hbs_options.fn(this);
    }
    return null;

  },

  progress(num_current, num_max, str_id) {

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
  },

  selector_group(str_type, str_name, json_choices, str_id) {

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

  },

  contains (arr, val, hbs_options) {
    if (arr.includes(val)) return hbs_options.fn();
  }
<<<<<<< HEAD
};
=======

};
>>>>>>> origin/frontend/helpers
