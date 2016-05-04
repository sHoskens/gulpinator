var gulp          = require('gulp'),
    gulpPrint     = require('gulp-print'),
    debug         = require('gulp-debug'),
    inject        = require('gulp-inject'),
    gulpif        = require('gulp-if'),
    util          = require('gulp-util'),
    eventStream   = require('event-stream'),
    streamSeries  = require('stream-series'),
    File          = require('vinyl'),
    rev           = require('gulp-rev'),
    lazypipe      = require('lazypipe'),
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
var defaultTransformer = function(filepath, file, index, length, targetFile) {
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

      var addInjectStreamPipe = function(injectStream, pipeContents) {
        return injectStream.pipe(pipeContents);
      };

      var addPipeIfInUse = function(pipes, pipeContent, transformer) {
        if (pipeContent && pipeContent._eventsCount && pipeContent._eventsCount > 0) {
          pipes.push(inject(pipeContent, {
            ignorePath: ignorePath,
            transform: transformer
          }));
        }

        return pipes;
      };

      var determineInjectStreamPipes = function() {
        var pipes = [];

        pipes.push(gulpif(config.verbose, gulpPrint(function(filepath) {
          return 'running inject-task on: ' + filepath;
        })));

        pipes = addPipeIfInUse(pipes, stylesStream, styleTransformer);
        pipes = addPipeIfInUse(pipes, scriptStream, scriptTransformer);
        pipes = addPipeIfInUse(pipes, libsStream, scriptTransformer);
        pipes = addPipeIfInUse(pipes, angularStream, scriptTransformer);

        pipes.push(gulp.dest(config.defaultDest));

        return pipes;
      };

      var createInjectStream = function() {
        var pipes = determineInjectStreamPipes();
        var injectStream = gulp.src(config.assetsSrc + '/**/*.html');

        for (var i = 0; i < pipes.length; i++) {
          injectStream = addInjectStreamPipe(injectStream, pipes[i]);
        }

        return injectStream;
      };

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

      return createInjectStream();
    };
  }
};
