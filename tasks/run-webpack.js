const gulp          = require('gulp'),
      path          = require('path'),
      gutil         = require('gulp-util'),
      webpack       = require('webpack-stream'),
      config        = require('../utilities/getConfig').getConfig()
      utility       = require('../utilities/utility');

const NAME = require('../utilities/taskNames').webpack;

/**
 * Create the default webpack configuration object. This does, however,
 * require a few options to be set in the gulpinator.config.js.
 * If these are not set, throw an error.
 *
 * @param file {Object} A file object, as defined in gulpinator.config.js.
 * This file object should, for this function, contain in it's options a
 * webpack object with a entry and output path, as string.
 * @returns {Object} A valid webpack configuration object.
 */
const createWebpackConfig = function(file) {
  if (!file.options.webpack || !file.options.webpack.entry || !file.options.webpack.output) {
    throw new gutil.PluginError({
      plugin: NAME,
      message: 'The configuration for a webpack task is incorrect. Your files.options object should contain at least an entry path and output path (string). Prefer absolute paths.'
    });

    return;
  }

  let fileName = (file.options.name || '[name]') + '.js';
  fileName = fileName === '[hash].js' ? '' : fileName;

  let baseConfig = {
    entry: {
      app: file.options.webpack.entry
    },
    output: {
      path: file.options.webpack.output,
      filename: fileName
    },
    module : {
      loaders: [
        {
          test   : /.js$/,
          loader : 'babel',
          query: {
            cacheDirectory: true,
            presets: ['es2015']
          }
        }
      ]
    }
  };

  return baseConfig;
};

/**
 * createWebpackStream
 * Creates a webpack stream.
 * This stream handles:
 * - compilation ES6 to valid current js.
 *
 * @param file: {Object} a file object as defined in the files array
 *  of gulpinator.config.js. Each file has at least a target property.
 *  This property is a String or an array of Strings, defining relative
 *  paths or glob patterns. Additionally, each file object has a String
 *  reference to the task itself (in this case 'run-webpack'), and an
 *  optional Options object.
 * @returns {Stream} A standard gulp stream, to be activated when necessary.
 */
const createWebpackStream = function(file) {
  // Either get the options for the file as defined in the config, or use
  // the default.
  let options = file.options || {};
  let dest = utility.getCorrectDest(file);

  let webpackConfig;
  if (options.customWebpackConfig) {
    gutil.log('--- USING CUSTOM WEBPACK CONFIG ---');
    webpackConfig = require(file.options.customWebpackConfig);
  }
  else {
    gutil.log('--- CREATING DEFAULT WEBPACK CONFIG ---')
    webpackConfig = createWebpackConfig(file, dest);
  }

  return gulp.src('src/defined/in/webpack/config')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(dest));
};

module.exports = {
  name: NAME,
  getStream: createWebpackStream
};
