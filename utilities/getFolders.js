// var fs = require('fs'),
//     path = require('path');

module.exports = {
  // Utility function to read multiple folders. For more information, see
  // https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md

  // TODO Deprecated! The entire getFolders functionality has
  // been deprecated due to npm package fs and path being removed.
  // Perhaps vinyl-fs will solve this?
  //

  getFolders: function(dir) {
    return [];
  }

  // getFolders: function(dir) {
  //   return fs.readdirSync(dir)
  //     .filter(function(file) {
  //       return fs.statSync(path.join(dir, file)).isDirectory();
  //     });
  // }
};
