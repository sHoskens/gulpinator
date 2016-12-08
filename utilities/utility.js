const gutil   = require('gulp-util'),
      config  = require('./getConfig').getConfig();

module.exports = {
  getCorrectDest: function(file) {
    let dest = config.options.dest;

    // Add extra directory to dest if supplied in options.
    if (file.options && file.options.dest) {
      // If user forgot to add a slash in the dest path, add it.
      if (dest[dest.length - 1] !== '/' && file.options.dest[0] !== '/') {
        dest += '/';
      }

      dest += file.options.dest;
    }

    return dest;
  },

  printTaskDetails: function(input, taskName, output) {
    if (config.options.verbose) {
      gutil.log(
        gutil.colors.red(input) + ' ' +
        gutil.colors.bgYellow('===[' + taskName + ']==>') + ' ' +
        gutil.colors.green(output)
      );
    }
  }
};