/*jshint esversion: 6 */
/*jshint node: true */

// Helper functions

// Helper functions always needs to take something in
function yell(msg) {
  // And need to return the same value that comes in (and changed if needed)
  return (msg.toUpperCase()) + '!!!';
}

function section(name, options) {

  if (!this._sections) this._sections = {};
  if (!this._sections.head) {
    this._sections[name] = options.fn(this);
  } else {
    this._sections[name] += options.fn(this);
  }
  return null;

}

function progress(current, max, id) {

  if (!this._sections) this._sections = {};
  if (!this._sections.head) {
    this._sections.head = '<link rel="stylesheet" href="/css/progress_bars.css">';
  } else {
    this._sections.head += '<link rel="stylesheet" href="/css/progress_bars.css">';
  }
  
  out = '<div class="progress-bar-wrapper"'+
        (typeof id === 'string' ? ` id="${id}">` : '>');
  let cbar = '<div class="bar compleated"></div>';
  let bar = '<div class="bar"></div>';
  let cstage = '<div class="stage compleated"><div></div></div>';
  let custage = '<div class="stage current"><div></div></div>';
  let stage = '<div class="stage"><div></div></div>';

  for (let i = 0; i < max; i++) {
    if (i != 0) out += i < current ? cbar : bar;
    if (i < current-1) {
      out += cstage;
    } else if (i == current-1) {
      out += custage;
    } else {
      out += stage;
    }
  }

  out += '</div>';

  return out;

}

module.exports = {
  yell,
  section,
  progress
};
