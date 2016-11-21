const gulp = require('gulp');
require('../index')(gulp);

// const config = require('./gulpinator.config');
//
//
//
// gulp.task('default', function() {
//   gutil.log(config);
//
//   return gulp.src(path.join(__dirname, 'src/styles', 'main.scss'))
//     .pipe(sass())
//     .on('end', function(){ gutil.log('Almost there...'); })
//     .pipe(gulp.dest('public/styles'))
//     .on('end', function(){ gutil.log('Done!'); });
// });