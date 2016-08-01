var gulp          = require('gulp'),
    gulpPrint     = require('gulp-print'),
    sourcemaps    = require('gulp-sourcemaps'),
    sass          = require('gulp-sass'),
    rename        = require('gulp-rename'),
    concat        = require('gulp-concat'),
    autoprefixer  = require('gulp-autoprefixer'),
    cleanCSS      = require('gulp-clean-css'),
    browserSync   = require('browser-sync'),
    gulpif        = require('gulp-if'),
    rev           = require('gulp-rev'),
    config        = require('../utilities/getConfig').getConfig(),
    exporter      = require('../utilities/createExportsObject');

var compileCss = function(src, filename, dest, options) {
  return gulp.src(src)
    .pipe(gulpif(config.verbose, gulpPrint(function(filepath) {
      return 'running css-task on: ' + filepath;
    })))
    .pipe(gulpif(options.sass, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(options.sass, sass({
        includePaths: config.sass.includePaths
      })))
      .pipe(gulpif(options.sass, autoprefixer('> 5%')))
      .pipe(gulpif(options.sass, cleanCSS({ compatibility: 'ie9' })))
    .pipe(gulpif(options.sass, sourcemaps.write('./')))
    //.pipe(gulpif(options.sass, rename(filename)))
    .pipe(gulpif(options.concat, concat(filename)))
    .pipe(gulpif(config.rev, rev()))

    // If using rev, don't use browsersync. That's silly.
    .pipe(gulpif(!config.rev, browserSync.stream()))
    .pipe(gulp.dest(config.defaultDest + '/' + config.dest.styles));
};

module.exports = compileCss;
