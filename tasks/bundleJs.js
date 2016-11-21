const gulp        = require('gulp'),
      gutil       = require('gulp-util'),
      concat      = require('gulp-concat'),
      uglify      = require('gulp-uglify'),
      rename      = require('gulp-rename'),
      gulpif      = require('gulp-if'),
      sourcemaps  = require('gulp-sourcemaps'),
      utility     = require('../utilities/utility'),
      config      = require('../utilities/getConfig').getConfig();

const NAME = require('../utilities/taskNames').jsBundle;

let increment = 1;

/**
 * createBundleJSStream
 * Creates a gulp stream for bundling javascript files.
 * This stream handles:
 *  - concatenation of seperate files into a single .js file
 *  - optional minification using uglify
 *  - adding an optional cache busting hash
 *  - optionally writing sourcemaps.
 *
 * @param file: {Object} a file object as defined in the files array
 *  of gulpinator.config.js. Each file has at least a target property.
 *  This property is a String or an array of Strings, defining relative
 *  paths or glob patterns. Additionally, each file object has a String
 *  reference to the task itself (in this case 'bundle-js'), and an
 *  optional Options object.
 * @returns {Stream} A standard gulp stream, to be activated when necessary.
 */
const createBundleJSStream = function(file) {
  // Either get the options for the file as defined in the config, or use
  // the default.
  let options = file.options || {
      sourcemaps: false,
      minify: false,
      hash: ''
    };

  options.name = options.name || 'script-bundle';

  // Add a suffix to the resulting file, depending on minification and cache busting.
  let suffix = options.minify ? '.min' : '';
  suffix += options.hash ? '.' + options.hash : '';

  // If several files use the default name, add an incrementing number.
  let incrementSuffix = (increment > 1) ? '-' + increment : '';
  increment++;

  let dest = utility.getCorrectDest(file);

  return gulp.src(file.target)
    .pipe(gulpif(options.sourcemaps, sourcemaps.init({ loadMaps: true })))
      .pipe(concat(options.name + '.js'))
      .pipe(gulpif(options.minify, uglify()))
      .on('error', gutil.log)
      .pipe(rename(function(path) {
        path.basename += incrementSuffix;
        path.basename += suffix;

        utility.printTaskDetails(file.target, NAME, dest + '/' + path.basename + path.extname);
      }))
    .pipe(gulpif(options.sourceMaps, sourcemaps.write('./')))
    .pipe(gulp.dest(dest));
};

module.exports = {
  name: NAME,
  getStream: createBundleJSStream
};
