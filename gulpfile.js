/*jshint esversion: 6 */
/*jshint node: true */

'use strict';

/*
 * ## Imports
 */

const settings = require('./configs/settings.json');
const gulp     = require('gulp');
const sass     = require('gulp-sass');
const pug      = require('gulp-pug2');
const nodemon  = require('gulp-nodemon');
const autopref = require('gulp-autoprefixer');

/*
 * ## Tasks
 */

gulp.task('sass', () => {
  return gulp.src('_sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autopref('last 2 version'))
    .pipe(gulp.dest(settings.server.base_dir + 'assets/css/'));
});

gulp.task('pug', () => {
  return gulp.src(['_pug/*.pug', '_pug/**/*.pug'])
    .pipe(pug({ yourTemplate: 'Locals' }))
    .pipe(gulp.dest(settings.server.base_dir));
});

gulp.task('server', () => {
  nodemon({
    'script': 'server/index.js',
    'watch': ['./server/*.js', './server/**/.js'],
    'ignore': ['./src/assets/js/*.js',
               '_js/*',
               '_sass/*']
  });
});

/*
 * ## Watch
 */

gulp.task('watch', function() {
    gulp.watch(['_sass/*.sass', '_sass/**/*.sass'], ['sass']);
    gulp.watch(['_pug/*.pug', '_pug/**/*.pug'], ['pug']);
});

gulp.task('default', ['server', 'watch']);