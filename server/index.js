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

  let recource = req.originalUrl.substring(1);
  if ( !ServerUtil.path_validate(recource) ) {
    res.sendStatus(403);
    return;
  }

  if (req.originalUrl == '/') {
    recource = 'index.html';
  }

  let dir = path.resolve(base_dir, recource);
  dir = ServerUtil.resolve_for_folder (dir);
  if (dir === null || !ServerUtil.exists(dir)) {
    res.sendStatus(404);
    return;
  }

  res.sendFile(dir);

});

/*
 * ## RUN
 */

app.listen(settings.server.port, () => {
  console.log('Server running on port ', settings.server.port);
  console.log('----------------------------------------------------------------------');
  console.log('| ## Open you favourite browsaer and navigate to "localhost:3000" ## |');
  console.log('----------------------------------------------------------------------');
});
