const gulp              = require('gulp'),
      util              = require('gulp-util'),
      config            = require('../utilities/getConfig').getConfig(),
      browsersync       = require('browser-sync'),
      _                 = require('lodash');

const NAME = require('../utilities/taskNames').serve;

// const createupWebpackDevServerStream = function(file) {
//   // Either get the options for the file as defined in the config, or use
//   // the default.
//   let options = file.options || {};
//   let dest = utility.getCorrectDest(file);
//
//   let webpackConfig;
//   if (options.customWebpackConfig) {
//     webpackConfig = require(file.options.customWebpackConfig);
//   }
//   else {
//     webpackConfig = createWebpackConfig(file);
//   }
// };

var createDevServerStream = function(useInjection) {
  if (browsersync.active) {
    return;
  }

  var options = createBrowsersyncOptions(config);
  var sources = createSources(config.files);

  browsersync.init(options);

  _.forEach(sources, function(source, key) {
    // gulp.watch(source, [key]).on('change', function(event) {
    //   changeEvent(event);
    // });
    gulp.watch(source, [key]);
  });

  // gulp.watch(sources.styles, ['compile-sass'])
  //     .on('change', function(event) { changeEvent(event); });
  //
  // gulp.watch(sources.scripts, ['compile-scripts'])
  //     .on('change', function(event) {
  //       changeEvent(event);
  //       browsersync.reload();
  //     });
  //
  // gulp.watch(sources.html, ['build-inject'])
  //     .on('change', function(event) { changeEvent(event); });
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
    websockets: false
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
      (sources[file.task] || (sources[file.task] = [])).push(file.target);
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