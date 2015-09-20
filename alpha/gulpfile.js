var gulp = require('gulp');
var to5 = require('gulp-6to5');
var connect = require('gulp-connect');

gulp.task('transform-src', function () {
  return gulp.src('src/**/*.js')
    .pipe(to5())
    .pipe(gulp.dest('public/javascript'))
    .pipe(connect.reload());
});

gulp.task('transform-demo', function () {
  return gulp.src('demo/**/*.js')
    .pipe(to5())
    .pipe(gulp.dest('public/javascript/demo'))
    .pipe(connect.reload());
});

gulp.task('server', function () {
  connect.server({
    root: 'public',
    livereload: true,
    port: 8085
  });
});

gulp.task('copy-static', function () {
  return gulp.src('static/**/*')
    .pipe(gulp.dest('public'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['static/**/*'], ['copy-static']);
  gulp.watch(['src/**/*'], ['transform-src']);
  gulp.watch(['demo/**/*'], ['transform-demo']);
});

gulp.task('default', ['server', 'watch']);
