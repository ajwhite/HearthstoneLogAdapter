var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    mocha = require('gulp-mocha');
    // babel = require('gulp-babel');

require('babel-core/register');

gulp.task('test', function () {
  gulp.src('test/spec/**/*.js')
  .pipe(mocha({reporter: 'spec', growl: true}));
});

gulp.task('e2e', function () {
  gulp.src('test/e2e/**/*.js')
  .pipe(mocha({reporter: 'spec', growl: true}));
});

gulp.task('watchtest', function () {
  gulp.src('test/spec/**/*.js')
  .pipe(plumber({
    errorHandler: function (err) {
      notify.onError({
        title: 'Unit Test',
        message: '<%= error.message %>'
      })(err);
      this.emit('end');
    }
  }))
  .pipe(mocha({reporter: 'spec', growl: true}));
});

gulp.task('watche2e', function () {
  gulp.src('test/e2e/**/*.js')
  .pipe(plumber({
    errorHandler: function (err) {
      notify.onError({
        title: 'Unit Test',
        message: '<%= error.message %>'
      })(err);
      this.emit('end');
    }
  }))
  .pipe(mocha({reporter: 'spec', growl: true}));
});

gulp.task('watch', ['watche2e'], function () {
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['watche2e']);
});
