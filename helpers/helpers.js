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

function _for(i, n, inc, block) {
  let out = '';
  for (let j = i; j < n; j += inc) {
    out += block.fn(j);
  }
  return out;
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

  out = '<div class="progress-bar-wrapper"'+
        (typeof str_id === 'string' ? ` id="${str_id}">` : '>');
  let cbar = '<div class="bar compleated"></div>';
  let bar = '<div class="bar"></div>';
  let cstage = '<div class="stage compleated"><div></div></div>';
  let custage = '<div class="stage current"><div></div></div>';
  let stage = '<div class="stage"><div></div></div>';

  for (let i = 0; i < num_max; i++) {
    if (i != 0) out += i < num_current ? cbar : bar;
    if (i < num_current-1) {
      out += cstage;
    } else if (i == num_current-1) {
      out += custage;
    } else {
      out += stage;
    }
  }

  out += '</div>';

  return out;
}

function selector_group (str_type, str_name, json_choices, str_id) {

  if (!this._sections) this._sections = {};
  if (!this._sections.head) {
    this._sections.head = '<link rel="stylesheet" href="/css/selector_group.css">';
  } else {
    this._sections.head += '<link rel="stylesheet" href="/css/selector_group.css">';
  }

  let arr_choices = JSON.parse(json_choices);

  out = '<div class="selector-group-wrapper"'+
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
  _for,
  section,
  progress,
  selector_group
};
