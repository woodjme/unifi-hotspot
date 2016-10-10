var gulp = require('gulp');
var gulpNSP = require('gulp-nsp');

gulp.task('default', ['nsp']);

gulp.task('nsp', function (cb) {
  gulpNSP({package: __dirname + '/package.json'}, cb);
});