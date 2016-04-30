var gulp          = require('gulp'),
    debug         = require('gulp-debug'),
    inject        = require('gulp-inject'),
    gulpif        = require('gulp-if'),
    util          = require('gulp-util'),
    eventStream   = require('event-stream'),
    streamSeries  = require('stream-series'),
    File          = require('vinyl'),
    rev           = require('gulp-rev'),
    config        = require('../utilities/getConfig').getConfig();

// These transformer functions ere used when we want seperate bundles for each
// html file. See the config file or README.md for more information.
// It checks if the file matches the desired bundles in the target file's
// page object in config.seperateBundlesPerPage.pages.
var getFileNames = function(filepath, targetFile) {
  // The inject transformer function gives us the filepath of the file to be
  // injected, and the actuall file of the target. Alas, such is life.

  var fileNames = {};
  // Create a vinyl file object from targetFile to get it's basename
  fileNames.targetName = new File(targetFile).basename;
  fileNames.targetName = fileNames.targetName.replace('.html', '');

  fileNames.fileName = filepath.substring(filepath.lastIndexOf('/') + 1);
  if (config.rev) {
    fileNames.fileName = fileNames.fileName.substring(0, fileNames.fileName.lastIndexOf('-'));
  }

  return fileNames;
};

// Searches for the given target file in the pages array. If it exists,
// checks this target's desired sources and wether the file to be injected
// matches a filename from these sources.
var checkIfFileMatches = function(fileNames, desiredBundles) {
  for (var i = 0; i < config.seperateBundlesPerPage.pages.length; i++) {
    var page = config.seperateBundlesPerPage.pages[i];
    if (page.names.indexOf(fileNames.targetName) > -1) {
      var desiredBundle = page[desiredBundles];
      if (desiredBundle.indexOf(fileNames.fileName) > -1) {
        return true;
      }
      else {
        i = config.seperateBundlesPerPage.pages; // stop loop
      }
    }
  }
  return false;
};

var scriptBundleTransformer = function(filepath, file, index, length, targetFile) {
  var fileNames = getFileNames(filepath, targetFile);

  fileNames.fileName = fileNames.fileName.replace('.js', '');

  if (checkIfFileMatches(fileNames, 'scriptBundles')) {
    return inject.transform.apply(inject.transform, arguments);
  }
};

var styleBundleTransformer = function(filepath, file, index, length, targetFile) {
  var fileNames = getFileNames(filepath, targetFile);

  fileNames.fileName = fileNames.fileName.replace('.css', '');

  if (checkIfFileMatches(fileNames, 'styleBundles')) {
    return inject.transform.apply(inject.transform, arguments);
  }
};

// The default transformer of gulp inject, used when seperate bundles are not
// desired.
var defaultTransformer = function() {
  return inject.transform.apply(inject.transform, arguments);
};

module.exports = {
  injectStylesAndScripts: function() {
    return function() {
      var scriptTransformer = (config.seperateBundlesPerPage.use) ? scriptBundleTransformer : defaultTransformer;
      var styleTransformer = (config.seperateBundlesPerPage.use) ? styleBundleTransformer : defaultTransformer;

      var stylesStream = require('./styles').getStream();

      var scriptStream = require('./scripts').getStream();

      var libsStream = require('./libs').getStream();

      var angularStream;
      if (config.angular.isAngularProject) {
        angularStream = streamSeries(
          require('./angularScripts').getStream(),
          require('./templateCache').getStream()
        );
      }

      var ignorePath = config.defaultDest + '/';
      var injectStream = gulp.src(config.assetsSrc + '/**/*.html')
        .pipe(inject(libsStream, {
          name: 'libs',
          ignorePath: ignorePath,
          transform: scriptTransformer
        }))
        .pipe(gulpif(config.angular.isAngularProject, inject(angularStream, {
          name: 'angular',
          ignorePath: ignorePath,
          transform: scriptTransformer
        })))
        .pipe(inject(stylesStream, {
          ignorePath: ignorePath,
          transform: styleTransformer
        }))
        .pipe(inject(scriptStream, {
          ignorePath: ignorePath,
          transform: scriptTransformer
        }))
        .pipe(gulp.dest(config.defaultDest));

      // Create rev manifests if necessary
      if (config.rev) {
        scriptStream
          .pipe(rev.manifest({ path:'rev-manifest-scripts.json', merge: false }))
          .pipe(gulp.dest(config.defaultDest));

        libsStream
          .pipe(rev.manifest({ path:'rev-manifest-libs.json', merge: false }))
          .pipe(gulp.dest(config.defaultDest));

        stylesStream
          .pipe(rev.manifest({ path:'rev-manifest-styles.json', merge: false }))
          .pipe(gulp.dest(config.defaultDest));

        if (config.angular.isAngularProject) {
          angularStream
            .pipe(rev.manifest({ path:'rev-manifest-ng.json', merge: false }))
            .pipe(gulp.dest(config.defaultDest));
        }
      }

      return injectStream;
    };
  }
};
