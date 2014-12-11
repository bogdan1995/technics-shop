"use strict";

var gulp = require('gulp'), 
	autoprefixer = require('gulp-autoprefixer'), 
	clean = require('gulp-clean'),
	gulpif = require('gulp-if'), 
	jade = require('gulp-jade'), 
	jshint = require('gulp-jshint'), 
	minifyCss = require('gulp-minify-css'),
	notify = require('gulp-notify'), 
	sass = require('gulp-sass'), 
	uglify = require('gulp-uglify'),
	uncss = require('gulp-uncss'), 
	useref = require('gulp-useref'),
	opn = require('opn'), 
	wiredep = require('wiredep'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: 'proj',
    livereload: true
  });
  opn('http://localhost:8080/');
});

gulp.task('wiredep', function () {    
  gulp.src('./proj/*.html')
    .pipe(wiredep({
        directory: './proj/bower_components'
    }))
    .pipe(gulp.dest('./proj'));
});

gulp.task('css', function () {
    gulp.src('./proj/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./proj/css'))
        .pipe(notify("SCSS done!"));
});

gulp.task('jade', function() {
  gulp.src('./proj/jade/_pages/*.jade')
    .pipe(jade({
    	pretty: true
    }))
    .pipe(gulp.dest('./proj/'))
    .pipe(connect.reload())
    .pipe(notify("Jade done!"));
});

// gulp.task('uncss', function() {
//     return gulp.src('./proj/css/style.css')
//         .pipe(uncss({
//             html: glob.sync('./proj/*.html')
//         }))
//         .pipe(notify("uncss done!"))
//         .pipe(gulp.dest('./proj/css'));
// });

gulp.task('jshint', function() {
  return gulp.src('./proj/js/*.js')
    .pipe(jshint())
    .pipe(notify("JS done!"));
});

gulp.task('watch', function () {
  gulp.watch(['./proj/jade/_pages/*.jade'], ['jade']);
  gulp.watch(['./proj/scss/**/*.scss'], ['css']);
  gulp.watch(['./proj/js/*.js'], ['jshint']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['clean'], function () { 
 	var assets = useref.assets();
  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src('dist').pipe(clean());
});


gulp.task('default', ['connect','watch']);