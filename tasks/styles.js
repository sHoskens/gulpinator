var gulp          = require('gulp'),
    gulpPrint     = require('gulp-print'),
    sourcemaps    = require('gulp-sourcemaps'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    cleanCSS      = require('gulp-clean-css'),
    browserSync   = require('browser-sync'),
    gulpif        = require('gulp-if'),
    rev           = require('gulp-rev'),
    revReplace    = require('gulp-rev-replace'),
    config        = require('../utilities/getConfig').getConfig(),
    exporter      = require('../utilities/createExportsObject');

var compileCssStream = function() {
  // Add extra stylesheets
  var cssPaths = [];
  if (config.extraStylesheets) {
    for (var j = 0; j < config.extraStylesheets.length; j++) {
      cssPaths.push(config.extraStylesheets[j]);
    }
  }

  cssPaths.push(config.stylesSrc + '/**/*.scss');

  return gulp.src(cssPaths)
    .pipe(gulpif(config.verbose, gulpPrint(function(filepath) {
      return 'running css-task on: ' + filepath;
    })))
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sass({
        includePaths: config.sass.includePaths
      }))
      .pipe(autoprefixer('> 5%'))
      .pipe(cleanCSS({ compatibility: 'ie9' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulpif(config.rev, rev()))

    // If using rev, don't use browsersync. That's silly.
    .pipe(gulpif(!config.rev, browserSync.stream()))
    .pipe(gulp.dest(config.defaultDest + '/' + config.dest.styles));
};

module.exports = exporter(compileCssStream);
