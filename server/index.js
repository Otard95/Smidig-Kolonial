/*jshint esversion: 6 */
/*jshint node: true */

/*
 * ## require / import
 */
const express  = require('express');
const settings = require('../configs/settings.json');

/*
 * ## Init
 */

const app = express();

/*
 * ## Events
 */

app.get('*', (req, res) => {
  console.log(req.path); // requested path/file
  res.send('Hello World!');
});

/*
 * ## RUN
 */

app.listen(settings.server.port, () => {
  console.log('Server running on port ', settings.server.port);
});
