module.exports = function(gulp) {

  const path        = require('path'),
        del         = require('del'),
        painter     = require('./tasks/painter'),
        taskManager = require('./utilities/taskManager'),
        gutil       = require('gulp-util'),
        config      = require('./utilities/getConfig').getConfig()
        taskNames   = require('./utilities/taskNames');

  const TASKS = {
    webpack: require('./tasks/run-webpack'),
    styles: require('./tasks/styles'),
    jsBundle: require('./tasks/bundleJs'),
    templates: require('./tasks/templates'),
    move: require('./tasks/moveFiles'),

    inject: require('./tasks/inject'),

    clean: taskNames.clean,
    destroy: taskNames.destroy,
    build: taskNames.build,
    serve: require('./tasks/dev-server')
  };

  // Allow some extra listeners in node.
  require('events').EventEmitter.prototype._maxListeners = 30;

  // This array will contain all tasks necessary for the regular, default build task, in order.
  let buildTaskDependencies = [];


  /**
   * Define tasks.
   * We define all tasks in their basic, single stream form.
   * Next, we define the serve version of that task, to be used with
   * browsersync.
   */
  for (let task of [TASKS.styles, TASKS.jsBundle, TASKS.webpack, TASKS.templates]) {
    gulp.task(task.name, function() {
      return taskManager.createSingleStream(task);
    });

    gulp.task('serve-' + task.name, function() {
      return taskManager.createServeStream(task);
    });
  }

  /**
   * File injection in html is a tricky thing. We need to get the correct, relative
   * paths of the files to inject, based on the result of several streams (tasks)
   * First, we need to check if any of the files defined in the config need injection.
   * If not, skip all fancy logic and just handle the regular tasks.
   */
  // File injection in html is a tricky thing. We need to get the correct, relative
  // paths of the files to inject, based on the result of several streams (tasks)
  // First, we need to check if any of the files defined in the config need injection.
  // If not, skip all fancy logic and just handle the regular tasks.
  let templateStreams = [];
  for (let file of config.files) {
    if (file.options && file.options.useInjection) {
      templateStreams.push(file);
    }
  }

  if (templateStreams.length) {
    // Using injection. Buckle up.
    gulp.task(TASKS.inject.name, function() {
      return TASKS.inject.createInjectPipeline(
        taskManager.createUnfinishedStream(TASKS.templates),
        [
          taskManager.createSeperateStreams(TASKS.styles),
          taskManager.createSeperateStreams(TASKS.jsBundle),
          taskManager.createSeperateStreams(TASKS.webpack)
        ]
      )
    });
    buildTaskDependencies.push(TASKS.inject.name);
  }
  else {
    // Not using injection. Just add all the streams to the dependencies
    // of the build task.
    buildTaskDependencies.push(TASKS.styles.name);
    buildTaskDependencies.push(TASKS.jsBundle.name);
    buildTaskDependencies.push(TASKS.webpack.name);
    buildTaskDependencies.push(TASKS.templates.name);
  }

  // Move additional files.
  gulp.task(TASKS.move.name, function() {
    return taskManager.createSingleStream(TASKS.move);
  });
  buildTaskDependencies.push(TASKS.move.name);

  // Clean the compilation folder of everything except images.
  gulp.task(TASKS.clean, function() {
    del.sync(
      [
        config.options.dest + '/**/*.js',
        config.options.dest + '/**/*.css',
        config.options.dest + '/**/*.html',
        config.options.dest + '/**/*.json',
        config.options.dest + '/**/*.map'
      ]
    );
  });

  // Clean everything
  gulp.task(TASKS.destroy, function() {
    del.sync([config.options.dest + '/**/*.*']);
  });

  // Create the main tasks, which run all other tasks defined above in correct order.
  gulp.task(TASKS.build, buildTaskDependencies, function() {
    if (config.paint) {
      if( config.options.paint.toLowerCase() === 'gulpinator') {
        painter.paintGulpinator();
      }
      else if (config.options.paint.toLowerCase() === 'bazookas') {
        painter.paintBazookas();
      }
    }
  });

  gulp.task(TASKS.serve.name,[TASKS.build],  function() {
    return TASKS.serve.getStream(templateStreams.length > 0);
  });

  // Copies all the default files (listed in default array above) to the current working directory.
  gulp.task('init', require('./tasks/init').init);

  gulp.task('default', [TASKS.build]);
};
