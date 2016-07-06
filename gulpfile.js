var gulp = require('gulp'),
  browser = require('browser-sync'),
  requireDir = require('require-dir'),
  panini = require('panini'),
  exec = require('child_process').exec,
  config = require('./gulp/config'),
  port = process.env.SERVER_PORT || 3000;

requireDir('gulp');



gulp.task('default', ['serve', 'watch']);


gulp.task('build', ['pages', 'scss', 'js'], function() {
  var images = [
    config.srcPath + 'assets/img/*'
  ];
  return gulp.src(images)
    .pipe(gulp.dest(config.destPath + 'assets/img/'));
});



gulp.task('serve', ['build'], function() {
  console.log('Initing browser sync!');
  browser.init({server: config.destPath, port: port});
});

gulp.task('publish', function(cb) {
  exec('git subtree push --prefix dist origin gh-pages', function(error, stdout, stderr) {
    console.log(stdout);
    cb();
  });
});

gulp.task('watch', function() {
  gulp.watch([config.srcPath + '{layouts,partials,helpers,data}/**/*'], ['pages']);
  gulp.watch([config.srcPath + 'pages/**/*'], ['pages']);
  //gulp.watch([config.buildPath + 'pages/**/*'], ['pages']);
  gulp.watch([config.srcPath + 'scss/**/*'], ['scss']);
  gulp.watch([config.distPath + '**/*'], [browser.reload]);
});