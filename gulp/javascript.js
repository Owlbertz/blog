var gulp = require('gulp'),
  concat = require('gulp-concat'),
  config = require('./config');

/**
 * Gulp task js.
 * Concates the JS dependencies.
 * Outputs to destPath.
 */
gulp.task('js', function () {
  return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/foundation-sites/dist/foundation.js', config.srcPath + 'assets/js/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.destPath + 'assets/js/'));
});
