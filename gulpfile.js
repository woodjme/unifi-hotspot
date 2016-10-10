var gulp = require('gulp');
var gulpNSP = require('gulp-nsp');
const path = require('path');

gulp.task('default', ['nsp']);

gulp.task('nsp', function (cb) {
  gulpNSP({package: path.join(__dirname, '/package.json')}, cb);
});