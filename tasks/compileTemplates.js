var gulp      = require('gulp'),
    config    = require('../utilities/getConfig').getConfig(),
    exporter  = require('../utilities/createExportsObject');

var compileTemplates = function() {
  return gulp.src(config.angular.angularSrc + '/templates/**/*.html')
    .pipe(gulp.dest('tmp'));
};

module.exports = exporter(compileTemplates);
