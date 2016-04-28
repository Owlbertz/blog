var gulp = require('gulp'),
  rename = require('gulp-rename'),
  sass = require('gulp-ruby-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  config = require('./config');

/**
 * Gulp task scss.
 * Concates the SCSS dependencies.
 * Outputs to destPath.
 */
gulp.task('scss', function () {
  return sass(config.srcPath + 'assets/scss/**/*.scss', {
      sourcemap: true,
      loadPath: ['node_modules/foundation-sites/scss']
    })
    .on('error', sass.logError)
    .pipe(gulp.dest(config.destPath + 'assets/css/'));
});