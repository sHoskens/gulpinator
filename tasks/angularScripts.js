var gulp        = require('gulp'),
    util        = require('gulp-util'),
    eventStream = require('event-stream'),
    getFolders  = require('../utilities/getFolders').getFolders,
    path        = require('path'),
    compileJs   = require('../utilities/compileJs'),
    config      = require('../utilities/getConfig').getConfig(),
    exporter    = require('../utilities/createExportsObject');

var compileAngularScripts = function() {
  // The streams variable will contain all the seperate gulp javascript
  // streams this task will produce. (i.e. seperate streams for each angular
  // module plus a stream for additional js code)
  var streams = [];
  var folders = getFolders(config.angular.angularSrc + '/modules');

  // Config.angular.singleModule determines wether all angular modules should be compiled
  // to a single file (and then minified) or wether we want seperate files for
  // each module. In the latter case, the file name is based on the name of the
  // module folder. See README.md for more details.
  if (config.angular.singleModule) {
    util.log(util.colors.blue('Compiling all angular modules in a single file'));

    var srcArray = [
      config.angular.angularSrc + '/' + config.angular.appName + '.js',
      config.angular.angularSrc + '/common/**/*.js'
    ];

    for (var i = 0; i < folders.length; i++) {
      srcArray.push(path.join(config.angular.angularSrc, folders[i], '*.js'));
    }

    streams.push(compileJs(srcArray, config.angular.appName + '.js', config.defaultDest, true));
  }
  else {
    // Make a seperate stream for each angular module.
    // Uglify and concat the main angular app
    var mainAngularAppStream = compileJs([
        config.angular.angularSrc + '/' + config.angular.appName + '.js',
        config.angular.angularSrc + '/common/**/*.js'],
        config.angular.appName + '.js',
        config.defaultDest,
        true
      );

    streams.push(mainAngularAppStream);

    // Make a gulp stream for each module in the src folder
    folders.map(function(folder) {
      util.log(util.colors.blue('Compiling angular module ' + folder));

      // For each folder in the modules, concat and uglify all the js files and
      // save in a seperate js file.
      streams.push(compileJs(
        path.join(config.angular.angularSrc, 'modules', folder, '**', '*.js'),
        folder + '.js',
        config.defaultDest,
        true
      ));
    });
  }

  return eventStream.merge(streams);
};

module.exports = exporter(compileAngularScripts);
