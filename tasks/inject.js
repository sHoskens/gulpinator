// Begone from here!
// Honestly, don't mess with this file, it has arcane and mysterious ways. I barely
// understand what's going on myself.
// If you have injections problems or bugs, you'd be better of writing your own custom
// injection task in gulpfile.js.

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

// The default transformer of gulp inject, used when seperate bundles are not
// desired.
var defaultTransformer = function(filepath, file, index, length, targetFile) {
  return inject.transform.apply(inject.transform, arguments);
};

module.exports = {
  injectStylesAndScripts: function() {
    return function() {
      var styleStreams = require('./styles').getSeperateStreams();

      var scriptStreams = require('./scripts').getSeperateStreams();

      var angularStream;
      if (config.angular.isAngularProject) {
        angularStream = streamSeries(
          require('./angularScripts').getStream(),
          require('./templateCache').getStream()
        );
      }

      var ignorePath = config.defaultDest + '/';
      var injectPrefix = '';
      var addRootSlash = true;
      if (typeof config.useHtmlInjection === 'object') {
        injectPrefix = config.useHtmlInjection.injectPrefix;
        addRootSlash = config.useHtmlInjection.addRootSlash;
      }

      var addPipeIfInUse = function(pipes, pipeContent, transformer, name) {
        if (pipeContent && pipeContent._eventsCount && pipeContent._eventsCount > 0) {
          pipes.push([
            inject,
            pipeContent,
            { ignorePath: ignorePath, transform: transformer, name: name, addPrefix: injectPrefix, addRootSlash: addRootSlash }
          ]);
        }

        return pipes;
      };

      var determineInjectStreamPipes = function() {
        var pipes = [];

        pipes.push([function() {
          return gulpif(config.verbose, gulpPrint(function(filepath) {
            return 'running inject-task on: ' + filepath;
          }));
        }]);

        pipes = addPipeIfInUse(pipes, angularStream, defaultTransformer, 'angular');

        for (var i = 0; i < styleStreams.length; i++) {
          pipes = addPipeIfInUse(pipes, styleStreams[i].stream, defaultTransformer, styleStreams[i].name);
        }

        for (i = 0; i < scriptStreams.length; i++) {
          pipes = addPipeIfInUse(pipes, scriptStreams[i].stream, defaultTransformer, scriptStreams[i].name);
        }

        return pipes;
      };

      var addPipeToStream = function(stream, pipeArguments) {
        // Since we're using lazyPipe, we can't just add the pipe. We need to add
        // the function, optionally followed by it's arguments, without calling it.
        stream = (stream) ? stream : lazypipe();
        return stream.pipe.apply(null, pipeArguments);
      };

      var createInjectStream = function() {
        var pipes = determineInjectStreamPipes(),
            injectLocations,
            injectStream;

        if (config.symfony.isSymfonyProject) {
          injectLocations = config.symfony.bundles;
        }
        else {
          injectLocations = [{
            injectFilesSrc: config.assetsSrc + '/**/*.html',
            injectTarget: config.defaultDest
          }];
        }

        for (var i = 0; i < pipes.length; i++) {
          injectStream = addPipeToStream(injectStream, pipes[i]);
        }

        var streams = [];
        for (i = 0; i < injectLocations.length; i++) {
          var stream = gulp.src(injectLocations[i].injectFilesSrc + '/**/*.html.twig')
              .pipe(injectStream())
              .pipe(gulp.dest(injectLocations[i].injectTarget));
          streams.push(stream);
        }
        return streams[0];
      };

      return createInjectStream();
    };
  }
};
