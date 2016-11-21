const _             = require('lodash'),
      gutil         = require('gulp-util'),
      eventStream   = require('event-stream'),
      config        = require('../utilities/getConfig').getConfig();

/**
 * getStreamsForTask
 * Creates an array of gulp streams for a task.
 *
 * @param task: {Object} a task object has this structure:
 *  {
 *    name: {String} the name of the task
 *    getStream: {Function} Expects a file object as defined in the
 *      gulpinator.config.js file files array. Necessary to tell the
 *      task on what it's target is and it's options.
 *      The function should return a stream, as defined with the
 *      standard gulp.src().pipe().pipe()... syntax.
 *  }
 * @returns {Array} An array of standard gulp streams. These streams
 * have not yet been activated.
 */
function getStreamsForTask(task) {
  let streams = [];

  if (config.files.length > 0) {
    for (let i = 0; i < config.files.length; i++) {
      if (config.files[i].task === task.name) {
        let name = '';
        if (config.files[i].options) {
          name = config.files[i].options.name;
        }

        streams.push({
          stream: task.getStream(config.files[i]),
          taskName: config.files[i].task,
          name: name
        });
      }
    }
  }

  if (!streams.length) {
    gutil.log('No files defined to run the ' + task.name + ' task on.');
  }

  return streams;
}

/**
 * Wrapper around the getStreamsForTask function.
 */
function createSeperateStreams(task) {
  return getStreamsForTask(task);
}

/**
 * createSingleStream
 * Merges the streams created by the getStreamsForTask function into
 * a single gulp stream.
 *
 * @param task: {Object} See the definition of the task parameter in
 *  the explanation of the getStreamsForTask function.
 * @returns {Function} Returns a single gulp stream.
 */
function createSingleStream(task) {
  let streams = getStreamsForTask(task);
  streams = _.map(streams, function(streamObj) {
    return streamObj.stream;
  });

  let stream = eventStream.merge(streams);

  return function() {
    return stream;
  }
}

/**
 * createUnfinishedStream
 * Returns an array of streams without a gulp.dest. Necessary if you want
 * to get fancy and dynamically add other pipelines to the stream.
 *
 * @param task: {Object} See the definition of the task parameter in
 *  the explanation of the getStreamsForTask function.
 * @returns {Function} Returns an array of unfinished gulp streams.
 */
function createUnfinishedStream(task) {
  if (task.getUnfinishedStream && typeof task.getUnfinishedStream === 'function') {
    let streams = [];

    if (config.files.length > 0) {
      for (let i = 0; i < config.files.length; i++) {
        if (config.files[i].task === task.name) {
          let unfinishedStream = task.getUnfinishedStream(config.files[i]);

          streams.push({
            unfinishedStream: unfinishedStream.unfinishedStream,
            name: task.name,
            dest: unfinishedStream.dest
          });
        }
      }
    }

    if (!streams.length) {
      gutil.log('No files defined to run the ' + task.name + ' task on.');
    }

    return streams;
  }
}

module.exports = {
  createSeperateStreams: createSeperateStreams,
  createSingleStream: createSingleStream,
  createUnfinishedStream: createUnfinishedStream
};
