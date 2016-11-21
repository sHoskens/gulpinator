var exec            = require('child_process').exec,
    activeDirectory = process.cwd(),
    defaults        = [
      '.babelrc',
      'gulpinator.config.js'
    ];

// Copies all the default files (listed in default array above) to the current working directory.
module.exports = {
  init: function init(cb) {
    var filesPath = '/{' + defaults.join(',') + '}';
    exec('cp ' + activeDirectory + '/node_modules/gulpinator/defaults' + filesPath + ' ' + activeDirectory + '/', function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
};
