/*jshint esversion: 6 */
/*jshint node: true */

/*
 * ## require / import
 */
const express      = require('express');
const hbs          = require('express-handlebars');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
//const multer       = require('multer');
const session      = require('express-session');
const helmet       = require('helmet');

//const upload = multer(); // for parsing multipart/form-data

// import routes
const index    = require('./routes/index');
const user     = require('./routes/user');
const calender = require('./routes/calender');
const checkout = require('./routes/checkout');
const api      = require('./routes/api')

// HBS helpers
const helpers = require('./helpers/helpers');

/*
 * ## Init
 */

const app = express();

// configure the view engine
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts',
  helpers
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(helmet());
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array());
app.use(express.static(path.join(__dirname, 'public')));

// set routes
app.use('/', index);
app.use('/user', user);
app.use('/kalender', calender);
app.use('/betaling', checkout);
app.use('/api', api);

/*
 *  ## Error handling
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {status: err.status, stack: JSON.stringify(err)});
});

module.exports = app;
