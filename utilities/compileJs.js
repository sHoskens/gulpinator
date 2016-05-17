var gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gulpPrint   = require('gulp-print'),
    jscs        = require('gulp-jscs'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    ngAnnotate  = require('gulp-ng-annotate'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    util        = require('gulp-util'),
    babel       = require('gulp-babel'),
    rev         = require('gulp-rev'),
    config      = require('./getConfig').getConfig();

// JS compile function
// This is the main javascript compilation function.
// src: the path to the javascript file(s). Optionally a glob pattern
// filename: the name of the concatenated, optionally minified output file
// dest: the destination path of the output file
// isAngular: wether these js files are angular (for ngAnnotate)
// Additional options, such as wether to lint or check code style,
// are supplied with the gulp.config.json file.
var compileJs = function(src, filename, dest, isAngular) {
  var taskName = isAngular ? 'ng-task' : 'js-task';

  return gulp.src(src)
    .pipe(gulpif(config.verbose, gulpPrint(function(filepath) {
      return 'running ' + taskName + ' on: ' + filepath;
    })))

    // Linting and style checking
    .pipe(gulpif(config.jscs, jscs()))
    .pipe(gulpif(config.jscs, jscs.reporter()))
    .pipe(gulpif(config.jshint, jshint()))
    .pipe(gulpif(
      config.jshint,
      jshint.reporter('jshint-stylish', { verbose: true }))
    )
    .pipe(gulpif(config.jshint, jshint.reporter('fail')))

    // Compilation
    .pipe(gulpif(config.sourceMaps, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(config.es6, babel()))
      .pipe(concat(filename))
      .pipe(gulpif(isAngular, ngAnnotate()))
      .pipe(gulpif(config.minify, uglify()))
      .on('error', util.log)
    .pipe(gulpif(config.sourceMaps, sourcemaps.write('./')))

    // Cache busting
    .pipe(gulpif(config.rev, rev()))

    .pipe(gulp.dest(dest));
};

module.exports = compileJs;
