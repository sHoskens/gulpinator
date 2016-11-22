const gulp = require('gulp');
const gulpinator = require('../index');

gulpinator.initializeSubTasks(gulp);

gulp.task('move-files', function() {
  // do something fancy.
});

gulpinator.initializeMainTasks(gulp);