var gulp        = require('gulp'),
    cache       = require('gulp-cache'),
    path        = require('path'),
    painter     = require('./tasks/painter'),
    config      = require('./utilities/getConfig').getConfig(),
    getFolders  = require('./utilities/getFolders').getFolders,
    del         = require('del'),
    taskListing = require('gulp-task-listing');

function initGulp() {
  require('events').EventEmitter.prototype._maxListeners = 30;

  // Move html to the tmp folder. If it's an angular project, all angular html templates
  // will be compiled to a templatecache linked to that module, depending on folder name.
  gulp.task('compile-templates', require('./tasks/compileTemplates').getTask());

  // Compile sass to css
  gulp.task('compile-sass', require('./tasks/styles').getTask());

  // Optimize images
  gulp.task('optimize-images', require('./tasks/image').getTask());

  // Concat and uglify the angular app, modules, scripts and libs
  gulp.task('compile-scripts', require('./tasks/scripts').getTask());

  if (config.angular.isAngularProject) {
    gulp.task('compile-angular-scripts', require('./tasks/angularScripts').getTask());
    gulp.task('compile-template-cache', ['compile-templates'],  require('./tasks/templateCache').getTask());
  }

  gulp.task('bundle-libs', require('./tasks/libs').getTask());

  // TODO move fonts, and check for possible extra font tasks

  gulp.task('move-additional-files', require('./tasks/moveAdditional').getTask());

  // Gulp task for unit testing and E2E testing
  //gulp.task('test', getTask('test'));

  // Html injection task. Injects the css and script tags in the index.html
  gulp.task('build-inject', ['compile-templates'], require('./tasks/inject').injectStylesAndScripts());

  gulp.task('move-html', function() {
    return gulp.src(config.assetsSrc + '/index.html')
      .pipe(gulp.dest(config.defaultDest));
  });

  // TODO Add testing!
  // 1. Run automated testing suit
  // 2. Make sure all js files from assets and angular are injected into
  //    Karma config file.
  // 3. Check for additional dependencies (think jquery)

  // Clean the public folder of everything except images.
  gulp.task('clean', function() {
    del.sync(
      [
        config.defaultDest + '/**/*.js',
        config.defaultDest + '/**/*.css',
        config.defaultDest + '/*.html',
        config.defaultDest + '/**/*.json',
        config.defaultDest + '/**/*.map'
      ]
    );
  });

  var buildTasks = [];

  buildTasks.push('optimize-images');
  buildTasks.push('move-additional-files');

  if (config.useHtmlInjection) {
    buildTasks.push('build-inject');
  }
  else {
    buildTasks.push('bundle-libs');
    buildTasks.push('compile-sass');
    buildTasks.push('compile-styles');
    buildTasks.push('move-html');
    if (config.angular.isAngularProject) {
      buildTasks.push('compile-angular-scripts');
      buildTasks.push('compile-template-cache');
    }
  }

  // jscs:disable
  gulp.task('build', buildTasks, function () {
    del.sync('tmp');
    painter.paintBazookas();
  });

  gulp.task('serve', ['build'], require('./tasks/serve-frontend').getTask());

  gulp.task('help', taskListing);

  gulp.task('default', ['help']);
}

module.exports = {
  initGulp: initGulp
};
