/*jshint esversion: 6 */
/*jshint node: true */

/*
 * ## require / import
 */
const path       = require('path');
const express    = require('express');
const settings   = require('../configs/settings.json');
const base_dir   = path.join(process.cwd(), settings.server.base_dir);
const ServerUtil = require('./bin/util.js')(base_dir);

/*
 * ## Init
 */

const app = express();

/*
 * ## Events
 */

app.get('*', (req, res) => {

  //console.log(req.path); // requested path/file
  //console.log(req.originalUrl.substring(1));
  //console.log(req.params);
  if ( !ServerUtil.path_validate(req.originalUrl.substring(1)) ) {
    res.sendStatus(403);
    return;
  }
  let dir = path.resolve(base_dir, req.originalUrl.substring(1));
  res.sendFile(dir);

});

/*
 * ## RUN
 */

app.listen(settings.server.port, () => {
  console.log('Server running on port ', settings.server.port);
});
