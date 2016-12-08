const path          = require('path'),
      gutil         = require('gulp-util');

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

module.exports = {
  create: createWebpackConfig
};