var gulp        = require('gulp'),
    util        = require('gulp-util'),
    browsersync = require('browser-sync'),
    config      = require('../utilities/getConfig').getConfig(),
    exporter    = require('../utilities/createExportsObject'),
    port        = config.browsersync.port,
    _           = require('lodash');

var serveFrontend = function() {
  return function() {
    if (browsersync.active) {
      return;
    }

    util.log(util.colors.green('Starting browser-sync on port ' + port));

    var options = createBrowsersyncOptions(config);
    var sources = createSources(config);

    browsersync.init(options);

    gulp.watch(sources.styles, ['compile-sass'])
        .on('change', function(event) { changeEvent(event); });

    gulp.watch(sources.scripts, ['compile-scripts'])
        .on('change', function(event) {
          changeEvent(event);
          browsersync.reload();
        });

    gulp.watch(sources.html, ['build-inject'])
        .on('change', function(event) { changeEvent(event); });

    if (config.angular.isAngularProject) {
      gulp.watch(sources.angularScripts, ['compile-angular-scripts'])
          .on('change', function(event) {
            changeEvent(event);
            browsersync.reload();
          });

      gulp.watch(sources.angularTemplates, ['compile-template-cache'])
          .on('change', function(event) {
            changeEvent(event);
            browsersync.reload();
          });
    }
  };
};

var createBrowsersyncOptions = function(config) {
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

  return options;
};

var createSources = function(config) {
  var sources = {};

  if (_.isEmpty(config.bundles)) {
    sources.styles = config.stylesSrc;
    sources.scripts = config.scriptSrc;
  }
  else {
    sources.styles = createSourcesArrayFromBundles(config.bundles, 'style');
    sources.scripts = createSourcesArrayFromBundles(config.bundles, 'script');
  }

  sources.styles = sources.styles;
  sources.scripts = sources.scripts;
  sources.html = config.assetsSrc;

  if (config.angular.isAngularProject) {
    sources.angularScripts = config.angular.angularSrc;
    sources.angularTemplates = config.angular.angularSrc;
  }

  return sources;
};

var createSourcesArrayFromBundles = function(bundles, type) {
  var sources = _.filter(bundles, function(bundle) {
    return bundle.type === type && bundle.watch;
  });

  sources = _.map(sources, function(source) {
    return source.sources;
  });

  return _.flatten(sources);
};

var changeEvent = function(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')');
  util.log(util.colors.blue('File ' + event.path.replace(srcPattern, '') + ' ' + event.type));
};

module.exports = exporter(serveFrontend());
