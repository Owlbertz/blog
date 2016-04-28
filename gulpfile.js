var gulp = require('gulp'),
  browser = require('browser-sync'),
  requireDir = require('require-dir'),
  panini = require('panini'),
  config = require('./gulp/config'),
  port = process.env.SERVER_PORT || 3000;

requireDir('gulp');



gulp.task('default', ['serve']);


gulp.task('build', ['pages', 'scss', 'js']);



gulp.task('serve', ['build'], function() {
  browser.init({server: config.destPath, port: port});
});

gulp.task('watch', function() {
  gulp.watch([config.srcPath + '{layouts,partials,helpers,data}/**/*'], [panini.refresh]);
  gulp.watch([config.srcPath + 'pages/**/*'], ['markdown']);
  gulp.watch([config.buildPath + 'pages/**/*'], [panini.refresh]);
  gulp.watch([config.srcPath + 'scss/**/*'], ['scss']);
  gulp.watch([config.distPath + '**/*'], [browser.reload]);
});