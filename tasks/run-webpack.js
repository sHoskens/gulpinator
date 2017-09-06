const gulp          = require('gulp'),
      webpack       = require('webpack'),
      gulpWebpack   = require('webpack-stream'),
      config        = require('../utilities/getConfig').getConfig(),
      utility       = require('../utilities/utility'),
      defWebpackConfig = require('../utilities/webpackConfig');

const NAME = require('../utilities/taskNames').webpack;

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
    webpackConfig = require(file.options.customWebpackConfig);
  }
  else {
    webpackConfig = defWebpackConfig.create(file);
  }

  return gulp.src('src/defined/in/webpack/config')
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(dest));
};

module.exports = {
  name: NAME,
  getStream: createWebpackStream
};
