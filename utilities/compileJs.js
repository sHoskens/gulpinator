var gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gulpPrint   = require('gulp-print'),
    jscs        = require('gulp-jscs'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    util        = require('gulp-util'),
    babel       = require('gulp-babel'),
    config      = require('./getConfig').getConfig();

// JS compile function
// This is the main javascript compilation function.
// src: the path to the javascript file(s). Optionally a glob pattern
// filename: the name of the concatenated, optionally minified output file
// dest: the destination path of the output file
// options: Wether it's an angular file, it should be minified, or it should be linted.
// Additional options, such as wether to lint or check code style,
// are supplied with the gulp.config.json file.
var compileJs = function(src, filename, dest, options) {
  var taskName = 'js-task';
  var lint = options.lint;
  var minify = options.minify;
  var es6 = options.es6;

  return gulp.src(src)
    .pipe(gulpif(config.verbose, gulpPrint(function(filepath) {
      return 'running ' + taskName + ' on: ' + filepath;
    })))

    // Linting and style checking
    .pipe(gulpif(lint, jscs()))
    .pipe(gulpif(lint, jscs.reporter()))
    .pipe(gulpif(lint, jshint()))
    .pipe(gulpif(
      lint,
      jshint.reporter('jshint-stylish', { verbose: true }))
    )
    .pipe(gulpif(lint, jshint.reporter('fail')))

    // Compilation
    .pipe(gulpif(config.sourceMaps, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(es6, babel()))
      .pipe(concat(filename))
      .pipe(gulpif(minify, uglify()))
      .on('error', util.log)
    .pipe(gulpif(config.sourceMaps, sourcemaps.write('./')))

    // Cache busting


    .pipe(gulp.dest(dest));
};

module.exports = compileJs;
