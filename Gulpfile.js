var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    mocha = require('gulp-mocha');
    // babel = require('gulp-babel');

require('babel-core/register');

gulp.task('test', function () {
  gulp.src(['test/spec/**/*.js', 'test/e2e/**/*.js'])
  .pipe(mocha({reporter: 'spec', growl: true}));
});

gulp.task('watchtests', function () {
  gulp.src(['test/spec/**/*.js', 'test/e2e/**/*.js'])
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

gulp.task('watch', ['watchtests'], function () {
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['watchtests']);
});
