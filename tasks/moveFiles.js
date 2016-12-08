const gulp        = require('gulp'),
      utility     = require('../utilities/utility'),
      gulpif      = require('gulp-if'),
      gutil       = require('gulp-util'),
      rename      = require('gulp-rename'),
      config      = require('../utilities/getConfig').getConfig();

const NAME = require('../utilities/taskNames').move;

/**
 * createMoveFilesStream
 * Creates a gulp stream for moving files
 * This stream handles:
 *  - moving a file to another location
 *
 * @param file: {Object} a file object as defined in the files array
 *  of gulpinator.config.js. Each file has at least a target property.
 *  This property is a String or an array of Strings, defining relative
 *  paths or glob patterns. Additionally, each file object has a String
 *  reference to the task itself (in this case 'move-files'), and
 *  an optional Options object.
 * @returns {Stream} A standard gulp stream, to be activated when necessary.
 */
const createMoveFilesStream = function(file) {
  let dest = utility.getCorrectDest(file);

  return gulp.src(file.target)
    .pipe(gulpif(config.options.verbose, rename(function(path) {
      utility.printTaskDetails(
        file.target, NAME, dest + '/' + path.basename + path.extname
      );
    })))
    .pipe(gulp.dest(dest));
};

module.exports = {
  name: NAME,
  getStream: createMoveFilesStream
};
