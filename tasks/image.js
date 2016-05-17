var gulp      = require('gulp'),
    imagemin  = require('gulp-imagemin'),
    gulpif    = require('gulp-if'),
    config    = require('../utilities/getConfig').getConfig(),
    exporter  = require('../utilities/createExportsObject');

var optimize = function() {
  return gulp.src(config.images.src + '/**')
    .pipe(gulpif(config.images.optimize, imagemin({ progressive: true })))
    .pipe(gulp.dest(config.defaultDest + '/img'));
};

module.exports = exporter(optimize);
