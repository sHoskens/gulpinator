const gulp         = require('gulp'),
      util         = require('gulp-util'),
      config       = require('../utilities/getConfig').getConfig(),
      browsersync  = require('browser-sync'),
      taskNames    = require('../utilities/taskNames'),
      gutil        = require('gulp-util'),
      _            = require('lodash');

const NAME = require('../utilities/taskNames').serve;

var createDevServerStream = function(useInjection) {
  if (browsersync.active) {
    return;
  }

  var options = createBrowsersyncOptions(config);
  var sources = createSources(config.files);

  browsersync.init(options);

  _.forEach(sources, function(source, key) {
    if (useInjection && key === 'serve-' + taskNames.templates) {
      gulp.watch(source, [taskNames.inject]).on('change', browsersync.reload);
    }
    else {
      gulp.watch(source, [key]);
    }
  });
};

/**
 * Creates a standard browsersync options object.
 * In gulpinator.config.options, you can define a browsersync object.
 * This object can contain these parameters:
 * - port
 * - isProxy
 * - proxyTarget
 * - websockets
 * - staticHtmlServer
 *
 * @param config: the gulpinator.config object.
 * @returns A valid webpack configuration object.
 */
var createBrowsersyncOptions = function(config) {
  let defaultOptions = {
    port: 8000,
    isProxy: false,
    proxyTarget: 3000,
    websockets: false,
    staticHtmlServer: false
  };

  if (!config.options.browsersync) {
    config.options.browsersync = defaultOptions;
  }

  var options = {
    port: config.options.browsersync.port || defaultOptions.port,
    ghostMode: {
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'info', // other option: debug
    logPrefix: 'browsersync',
    notify: true,
    reloadDelay: 1000,
    files: [
      config.options.dest
    ]
  };

  if (config.options.browsersync.isProxy) {
    options.proxy = {
      target: config.browsersync.proxyTarget || defaultOptions.proxyTarget,
      ws: config.browsersync.websockets || defaultOptions.websockets
    };
  }
  else {
    options.server = {
      baseDir: config.options.dest
    };

    if (config.options.browsersync.staticHtmlServer) {
      options.server['serveStaticOptions'] = {
        extensions: ['html']
      }
    }
  }

  return options;
};

/**
 * Runs through the files array in the gulpinator.config, and checks
 * for tasks and files to watch.
 *
 * @param config: gulpinator.config
 * @returns {Object} A collection of arrays. The key is the taskname, and the
 * array contains the paths of the task target.
 */
var createSources = function(files) {
  let sources = {};
  _.forEach(files, function(file) {
    if (file.options && file.options.watch) {
      let target = typeof file.options.watch === 'string' ? file.options.watch : file.target;
      let taskName = 'serve-' + file.task;

      (sources[taskName] || (sources[taskName] = [])).push(target);
    }
  });

  sources = _.mapValues(sources, function(source) {
    return _.flattenDeep(source);
  });

  return sources;
};

var changeEvent = function(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')');
  util.log(util.colors.blue('File ' + event.path.replace(srcPattern, '') + ' ' + event.type));
};

module.exports = {
  name: NAME,
  getStream: createDevServerStream
};