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

  this._sections[name] = options.fn(this);

}

module.exports = {
  yell,
  section
};
