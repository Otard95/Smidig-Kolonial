/*jshint esversion: 6 */
/*jshint node: true */

'use strict';

/*
 * ## Imports
 */

const settings = require('./configs/settings.json');
const path     = require('path');
const gulp     = require('gulp');
const sass     = require('gulp-sass');
const pug      = require('gulp-pug2');
const nodemon  = require('gulp-nodemon');
const autopref = require('gulp-autoprefixer');

/*
 * ## Tasks
 */

gulp.task('sass', () => {
  return gulp.src(['./_sass/(!imports)/*.sass', './_sass/*.sass'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autopref('last 2 version'))
    .pipe(gulp.dest(path.resolve('./', settings.server.base_dir + 'css/')));
});

gulp.task('server', () => {
  nodemon({
    'script': './bin/www',
    'watch': ['./*.js',
              './routes/*.js',
              './bin/*.js',
              './configs/*.json'],
    'ignore': ['./public/*']
  });
});

/*
 * ## Watch
 */

gulp.task('watch', function() {
    gulp.watch(['_sass/*.sass', '_sass/**/*.sass'], ['sass']);
});

gulp.task('default', ['server', 'watch']);
