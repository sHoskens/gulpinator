const gulp          = require('gulp'),
      gutil         = require('gulp-util'),
      sourcemaps    = require('gulp-sourcemaps'),
      sass          = require('gulp-sass'),
      concat        = require('gulp-concat'),
      rename        = require('gulp-rename')
      autoprefixer  = require('gulp-autoprefixer'),
      cleanCSS      = require('gulp-clean-css'),
      gulpif        = require('gulp-if'),
      config        = require('../utilities/getConfig').getConfig()
      utility       = require('../utilities/utility'),
      exporter      = require('../utilities/createExportsObject');

const NAME = 'compile-sass';

/**
 * createCompileSassStream
 * Creates a gulp stream for bundling css files.
 * This stream handles:
 * - compilation of sass to .css
 * - autoprefixing css properties to be compliant with the top browsers.
 * Top browsers are browsers with more then 5% of the total userbase.
 * - cleanup CSS, with a minimum compatibility of IE9, that harlot
 * - optionally write sourcemaps
 * - optionally add cache busting hashes.
 *
 * @param file: {Object} a file object as defined in the files array
 *  of gulpinator.config.js. Each file has at least a target property.
 *  This property is a String or an array of Strings, defining relative
 *  paths or glob patterns. Additionally, each file object has a String
 *  reference to the task itself (in this case 'compile-sass'), and an
 *  optional Options object.
 * @returns {Stream} A standard gulp stream, to be activated when necessary.
 */
let createCompileSassStream = function(file) {
  // Either get the options for the file as defined in the config, or use
  // the default.
  let options = file.options || {
      sourcemaps: false,
      hash: ''
    };

  let useSourcemaps = config.options.sourcemaps;
  let dest = utility.getCorrectDest(file);

  // Add a suffix to the resulting file, depending on cache busting.
  let suffix = options.hash ? '.' + options.hash : '';


  return gulp.src(file.target)
    .pipe(gulpif(useSourcemaps, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(config.options.verbose, rename(function(path) {
        path.basename += suffix;

        utility.printTaskDetails(
          file.target, NAME, dest + '/' + path.basename + path.extname
        );
      })))
      .pipe(sass())
      .pipe(autoprefixer('> 5%'))
      .pipe(cleanCSS({ compatibility: 'ie9' }))
    .pipe(gulpif(useSourcemaps, sourcemaps.write('./')))
    .pipe(gulp.dest(dest));
};

module.exports = {
  name: NAME,
  getStream: createCompileSassStream
};
