const gulp          = require('gulp'),
      imagemin      = require('gulp-imagemin'),
      rename        = require('gulp-rename'),
      gulpif        = require('gulp-if'),
      config        = require('../utilities/getConfig').getConfig(),
      utility       = require('../utilities/utility');


const NAME = require('../utilities/taskNames').images;

/**
 * createOptimizeImagesStream
 * Creates a gulp stream for optimizing images
 * This stream handles:
 *  - minifying an image using gulp-imagemin
 *
 * @param file: {Object} a file object as defined in the files array
 *  of gulpinator.config.js. Each file has at least a target property.
 *  This property is a String or an array of Strings, defining relative
 *  paths or glob patterns. Additionally, each file object has a String
 *  reference to the task itself (in this case 'optimize-images'), and
 *  an optional Options object.
 * @returns {Stream} A standard gulp stream, to be activated when necessary.
 */
const createOptimizeImagesStream = function(file) {
  let dest = utility.getCorrectDest(file);

  return gulp.src(file.target)
    .pipe(gulpif(config.options.verbose, rename(function(path) {
      utility.printTaskDetails(
        file.target, NAME, dest + '/' + path.basename + path.extname
      );
    })))
    .pipe(imagemin([], { verbose: config.options.verbose }))
    .pipe(gulp.dest(dest));
};

module.exports = {
  name: NAME,
  getStream: createOptimizeImagesStream
};