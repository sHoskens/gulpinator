const gulp        = require('gulp'),
      inject      = require('gulp-inject'),
      gutil       = require('gulp-util'),
      lazypipe    = require('lazypipe'),
      eventStream = require('event-stream'),
      config      = require('../utilities/getConfig').getConfig(),
      taskNames   = require('../utilities/taskNames');

const NAME = require('../utilities/taskNames').inject;

const ignorePath = config.options.dest + '/',
      injectPrefix = config.options.injectPrefix || '',
      addRootSlash = config.options.addRootSlash || false;

// The default transformer of gulp inject. Doesn't really do anything at
// the moment, but I've placed it here if I need a quick way to change
// the output of the injection or injected files.
const defaultTransformer = function(filepath, file, index, length, targetFile) {
  // if (config.cacheBustingVersion && typeof config.cacheBustingVersion === 'string') {
  //   filepath += '?v=' + config.cacheBustingVersion;
  // }

  if (injectPrefix) {
    filepath = injectPrefix + filepath;
  }

  return inject.transform.apply(inject.transform, arguments);
};

// Helper function to add a pipe with correct arguments.
let addPipeIfInUse = function(pipes, pipeContent, transformer, name) {
  if (pipeContent && pipeContent._eventsCount && pipeContent._eventsCount > 0) {
    pipes.push([
      inject,
      pipeContent,
      {
        ignorePath: ignorePath,
        transform: transformer,
        name: name,
        addRootSlash: addRootSlash }
    ]);
  }

  return pipes;
};

/**
 * createInjectPipelines
 * Creates an array of gulp pipes with all injectable streams of
 * the project. Unnamed streams will be merged, and injected within
 * the standard gulp-inject html comments. For example, all regular
 * streams from the bundle-js task will be injected between
 * <!-- inject:js --> and <!-- endinject -->.
 * If a streams has a name, we want to inject it only between named
 * comments, like so <!-- name:js -->.
 *
 * @param injectableStreams: {Array} all streams resulting in files
 * which can be injected in a template.
 * @returns {Array} An array of gulp pipes. (functions to be consumed
 *  by the gulpStream.pipe() function)
 */
let createInjectPipelines = function(injectableStreams) {
  let pipes = [];

  for (let i = 0; i < injectableStreams.length; i++) {
    let streamArray = injectableStreams[i];

    let mergeableStreams = [];
    let mergeStreamName = '';

    for (let j = 0; j < streamArray.length; j++) {
      let currentStream = streamArray[j];

      if (currentStream.name) {
        pipes = addPipeIfInUse(pipes, currentStream.stream, defaultTransformer, currentStream.name);
      }
      else {
        mergeableStreams.push(currentStream.stream);
        mergeStreamName = currentStream.taskName;
      }
    }

    let mergedStream = eventStream.merge(mergeableStreams);
    pipes = addPipeIfInUse(pipes, mergedStream, defaultTransformer, mergeStreamName);
  }

  return pipes;
};

module.exports = {
  name: NAME,

  /**
   * createInjectPipeline
   * This function is responsible for creating a correct pipeline
   * for injection.
   * It expects 'templateStreams', containing all streams which
   * result in template files (.html) which desire some files to be
   * injected in them. These templates tell gulpinator where to inject
   * using html comments. Check out gulp-inject plugin for more details.
   * It also expects all the 'injectableStreams', i.e. streams resulting
   * in files which can be injected, such as .js or .css files.
   *
   * @param templateStreams: {Array} all streams resulting in compiled
   * templates. Note that this array does not just expect streams, but
   * objects with the following structure:
   *    {
   *      stream: The actual, unfinished stream. (no gulp.dest has been
   *              piped into this stream.)
   *      dest: The destination of these templates.
   *    }
   * @param injectableStreams: {Array} all streams resulting in files
   * which can be injected in a template.
   * @returns {Object} The finished gulp inject stream.
   */
  createInjectPipeline: function(templateStreams, injectableStreams) {
    // Lazily add the pipe to the stream using lazyPipe.
    // We use apply to add the arguments to the function, without calling it.
    let addPipeToStream = function(stream, pipeArguments) {
      stream = (stream) ? stream : lazypipe();
      return stream.pipe.apply(null, pipeArguments);
    };

    let pipes = createInjectPipelines(injectableStreams);

    if (pipes.length) {
      let injectStream;

      for (let i = 0; i < pipes.length; i++) {
        injectStream = addPipeToStream(injectStream, pipes[i]);
      }

      let resultStreams = [];
      for (let i = 0; i < templateStreams.length; i++) {
        if (templateStreams[i].unfinishedStream) {
          templateStreams[i].unfinishedStream
            .pipe(injectStream()) // lazy loaded inject pipeline
            .pipe(gulp.dest(templateStreams[i].dest));

          resultStreams.push(templateStreams[i].unfinishedStream);
        }
      }

      return eventStream.merge(resultStreams);
    }
    else {
      gutil.log(gutil.colors.red('No valid injectable streams defined.'));
    }
  }
};
