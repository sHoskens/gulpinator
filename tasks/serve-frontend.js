var gulp        = require('gulp'),
    util        = require('gulp-util'),
    browsersync = require('browser-sync'),
    config      = require('../utilities/getConfig').getConfig(),
    exporter    = require('../utilities/createExportsObject'),
    port        = config.browsersync.port;

var serveFrontend = function() {
  return function() {
    if (browsersync.active) {
      return;
    }

    util.log(util.colors.green('Starting browser-sync on port ' + port));

    var options = {
      port: config.browsersync.port,
      ghostMode: {
        clicks: true,
        location: false,
        forms: true,
        scroll: true
      },
      injectChanges: true,
      logFileChanges: true,
      logLevel: config.browsersync.debug ? 'debug' : 'info',
      logPrefix: 'browsersync',
      notify: true,
      reloadDelay: 1000,
      files: [
        config.defaultDest + '/*/**.js',
        config.defaultDest + '/*/**.css',
        config.defaultDest + '/*/**.html'
      ]
    };

    if (config.browsersync.isProxy) {
      options.proxy = {
        target: config.browsersync.proxyTarget,
        ws: config.browsersync.websockets
      };
    }
    else {
      options.server = {
        baseDir: config.defaultDest + '/'
      };
    }

    browsersync.init(options);

    gulp.watch(config.assetsSrc + '/**/*.scss', ['compile-sass'])
        .on('change', function(event) { changeEvent(event); });

    gulp.watch(config.assetsSrc + '/**/*.js', ['compile-scripts'])
        .on('change', function(event) {
          changeEvent(event);
          browsersync.reload();
        });

    gulp.watch(config.assetsSrc + '**/*.html', ['build-inject'])
        .on('change', function(event) { changeEvent(event); });

    if (config.angular.isAngularProject) {
      gulp.watch(config.angular.angularSrc + '/**/*.js', ['compile-angular-scripts'])
          .on('change', function(event) {
            changeEvent(event);
            browsersync.reload();
          });

      gulp.watch(config.angular.angularSrc + '/**/*.html', ['compile-template-cache'])
          .on('change', function(event) {
            changeEvent(event);
            browsersync.reload();
          });
    }
  };
};

var changeEvent = function(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')');
  util.log(util.colors.blue('File ' + event.path.replace(srcPattern, '') + ' ' + event.type));
};

module.exports = exporter(serveFrontend());
