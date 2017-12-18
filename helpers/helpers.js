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

module.exports = {
  yell,
  times,
  _for
};
