// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var clean = require('gulp-clean-css');

gulp.task('sass', function(cb) {
  gulp
    .src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(concat('root.css'))
    .pipe(clean())
    .pipe(
      gulp.dest('./dist/Styles/')
    );
  cb();
});

gulp.task(
  'default',
  gulp.series('sass', function(cb) {
    gulp.watch('./src/scss/*.scss', gulp.series('sass'));
    cb();
  })
);