/*jshint esversion: 6 */
/*jshint node: true */

const path = require('path');

class ServerUtil {

  constructor (base) {
    this.base = base;
  }

  path_validate ( x ) {

    let dir = path.resolve(this.base, x);
    let rel = path.relative(this.base, dir);

    return !rel.includes('..'+path.sep);

  }

}

module.exports = base => {
  return new ServerUtil(base);
};
