module.exports = function(gulp) {
  var cache       = require('gulp-cache'),
      path        = require('path'),
      painter     = require('./tasks/painter'),
      config      = require('./utilities/getConfig').getConfig(),
      getFolders  = require('./utilities/getFolders').getFolders,
      del         = require('del'),
      taskListing = require('gulp-task-listing');

  require('events').EventEmitter.prototype._maxListeners = 30;

  // Make sure all bundles have at least default options
  // for (var i = 0; i < config.bundles.length; i++) {
  //   var bundle = config.bundles[i];
  //   bundle.isAngular = bundle.isAngular ? bundle.isAngular : false;
  //   bundle.minify = bundle.minify ? bundle.minify : false;
  //   bundle.lint = bundle.lint ? bundle.lint : false;
  //   bundle.es6 = bundle.es6 ? bundle.es6 : false;
  // }

  // Copies all the default files (listed in default array above) to the current working directory.
  gulp.task('init', require('./tasks/init').init);

  // Move html to the tmp folder.
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

  // Bundles all chosen library files
  gulp.task('bundle-scripts', require('./tasks/bundles').getTask());

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

  gulp.task('destroy', function() {
    del.sync([config.defaultDest + '/**/*.*']);
  });

  var buildTasks = [];

  buildTasks.push('optimize-images');
  buildTasks.push('move-additional-files');

  if (config.useHtmlInjection) {
    buildTasks.push('build-inject');
  }
  else {
    buildTasks.push('bundle-scripts');
    buildTasks.push('compile-scripts');
    buildTasks.push('compile-sass');
    buildTasks.push('move-html');
    if (config.angular.isAngularProject) {
      buildTasks.push('compile-angular-scripts');
      buildTasks.push('compile-template-cache');
    }
  }

  // jscs:disable
  gulp.task('build', buildTasks, function () {
    del.sync('tmp');
    if( config.paint === 'Gulpinator') {
      painter.paintGulpinator();
    }
    else if (config.paint === 'Bazookas') {
      painter.paintBazookas();
    }
  });

  gulp.task('serve', ['build'], require('./tasks/serve-frontend').getTask());

  gulp.task('help', taskListing);

  gulp.task('default', ['help']);
};
