/*jshint esversion: 6 */
/*jshint node: true */

const path = require('path');
const fs   = require('fs');

class ServerUtil {

  constructor (base) {
    this.base = base;
  }

  path_validate ( x ) {

    let dir = path.resolve(this.base, x);
    let rel = path.relative(this.base, dir);

    return !rel.includes('..'+path.sep);

  }

  exists ( x ) {

    try {
      fs.statSync(x);
      return true;
    } catch (e) {
      return false;
    }

  }

  resolve_for_folder ( x ) {

    if (!this.exists(x)) return null;

    let stat = fs.statSync(x);
    if (stat.isDirectory()) {
      return path.join(x, 'index.html');
    } else {
      return x;
    }

  }

}

module.exports = (base) => {
  return new ServerUtil(base);
};
