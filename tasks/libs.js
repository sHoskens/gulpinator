var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    gulpif      = require('gulp-if'),
    uglify      = require('gulp-uglify'),
    eventStream = require('event-stream'),
    gulpPrint   = require('gulp-print'),
    changed     = require('gulp-changed'),
    rev         = require('gulp-rev'),
    config      = require('../utilities/getConfig').getConfig(),
    exporter    = require('../utilities/createExportsObject');

var compileLibs = function() {
  var streams = [];

  // JS compile function
  function compileJsLibs(src, filename, dest, minify) {
    return gulp.src(src)
      .pipe(gulpif(config.verbose, gulpPrint(function(filepath) {
        return 'running libs-task on: ' + filepath;
      })))
      .pipe(concat(filename))
      .pipe(gulpif(minify, uglify()))
      .pipe(gulpif(config.rev, rev()))
      .pipe(gulp.dest(dest + '/scripts'));
  }

  // For every item in the config.libraries array, create a bundled js file in the dist folder
  for (var i = 0; i < config.libraries.length; i++) {
    var bundle = config.libraries[i],
        stream = compileJsLibs(
          bundle.sources, bundle.name + '.js',
          config.defaultDest,
          bundle.minify
        );

    streams.push(stream);
  }

  return eventStream.merge(streams);
};

module.exports = exporter(compileLibs);
