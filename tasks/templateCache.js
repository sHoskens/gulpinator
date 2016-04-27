var gulp                  = require('gulp'),
    util                  = require('gulp-util'),
    path                  = require('path'),
    minifyHtml            = require('gulp-minify-html'),
    angularTemplatecache  = require('gulp-angular-templatecache'),
    concat                = require('gulp-concat'),
    getFolders            = require('../utilities/getFolders').getFolders,
    eventStream           = require('event-stream'),
    rev                   = require('gulp-rev'),
    gulpif                = require('gulp-if'),
    config                = require('../utilities/getConfig').getConfig(),
    exporter              = require('../utilities/createExportsObject');

var compileTemplateCache = function() {
  function templateCache(src, moduleName) {
    util.log(
      util.colors.blue('Placing templates of ' +
      (moduleName ? 'module ' + moduleName : 'main app') +
      ' in templateCache...'
    ));
    if (!moduleName) {
      moduleName = config.angular.appName;
    }

    return gulp.src(path.join(src, '/*.html'))
      .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(angularTemplatecache(moduleName, {
        module: moduleName,
        root: 'templates'
    }))
      .pipe(concat(moduleName + '-tmpl.js'))
      .pipe(gulpif(config.rev, rev()))
      .pipe(gulp.dest(config.defaultDest + '/templates'));
  }

  var streams = [];
  try {
    var folders = getFolders('tmp/modules');
    if (folders || folders[0] === 'undefined') {
      var moduleTemplatesStream = folders.map(function(folder) {
        streams.push(templateCache('tmp/modules/' + folder, folder));
      });

      streams.push(templateCache('tmp'));

      return eventStream.merge(streams);
    }
    else {
      return templateCache('tmp');
    }
  }
  catch (err) {
    return templateCache('tmp');
  }
};

module.exports = exporter(compileTemplateCache);
