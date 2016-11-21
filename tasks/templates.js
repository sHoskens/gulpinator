const gulp        = require('gulp'),
      utility     = require('../utilities/utility'),
      gulpif      = require('gulp-if'),
      rename      = require('gulp-rename'),
      mustache    = require('gulp-mustache'),
      config      = require('../utilities/getConfig').getConfig();

const NAME = require('../utilities/taskNames').templates;

/**
 * createTemplatesStream
 * Creates a gulp stream for compiling template files.
 * This stream handles:
 *  - compilation of a template (.mustache) file to .html
 *
 * @param file: {Object} a file object as defined in the files array
 *  of gulpinator.config.js. Each file has at least a target property.
 *  This property is a String or an array of Strings, defining relative
 *  paths or glob patterns. Additionally, each file object has a String
 *  reference to the task itself (in this case 'compile-templates'), and
 *  an optional Options object.
 * @returns {Stream} A standard gulp stream, to be activated when necessary.
 */
const createTemplatesStream = function(file) {
  let stream = createUnfinishedTemplatesStream(file);

  return stream.unfinishedStream.pipe(gulp.dest(stream.dest));
};

const createUnfinishedTemplatesStream = function(file) {
  let dest = utility.getCorrectDest(file);

  return {
    dest: dest,
    unfinishedStream: gulp.src(file.target)
      .pipe(gulpif(file.options && file.options.templateLang === 'mustache' ,mustache()))
      .pipe(gulpif(config.options.verbose, rename(function (path) {
        path.extname = '.html';

        utility.printTaskDetails(
          file.target, NAME, dest + '/' + path.basename + path.extname
        );
      })))
  };
};

module.exports = {
  name: NAME,
  getStream: createTemplatesStream,
  getUnfinishedStream: createUnfinishedTemplatesStream
};
