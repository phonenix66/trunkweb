var app = {
  srcPath: './',
  devPath: './'
};

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  connect = require('gulp-connect');

gulp.task('connect', function () {
  connect.server({
    root: app.srcPath,
    livereload: true,
    port: 3000
  })
});

gulp.task('css', function () {
  return gulp.src('css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css/'))
    .pipe(connect.reload());
})
// 监听任务
gulp.task('watch', function () {
  // 监听根目录下所有.js文件
  gulp.watch('./modules/**/*.js').on('change', () => {
    gulp.src('./modules/**/*.js', {
      read: false
    }).pipe(connect.reload());
  });
  gulp.watch('./modules/**/*.html').on('change', () => {
    gulp.src('./modules/**/*.html', {
      read: false
    }).pipe(connect.reload());
  });
  gulp.watch('css/*.scss', gulp.series('css'));
  // gulp.watch('./css/**/*.css').on('change', () => {
  //   gulp.src('./css/**/*.css', {
  //     read: false
  //   }).pipe(connect.reload());
  // })
});

gulp.task('default', gulp.parallel('connect', 'watch', 'css', function () {
  console.log('default');
}))