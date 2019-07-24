var app = {
  srcPath: './',
  devPath: './'
};

var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function () {
  connect.server({
    root: app.srcPath,
    livereload: true,
    port: 3100
  })
});

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
  // gulp.watch('./css/**/*.css').on('change', () => {
  //   gulp.src('./css/**/*.css', {
  //     read: false
  //   }).pipe(connect.reload());
  // })
});

gulp.task('default', gulp.parallel('connect', 'watch', function () {
  console.log('default');
}))