"use strict";

var gulp = require('gulp'), 
	autoprefixer = require('gulp-autoprefixer'), 
	clean = require('gulp-clean'),
	connect = require('gulp-connect'), 
	csscomb = require('gulp-csscomb'), 
	gulpif = require('gulp-if'), 
	jade = require('gulp-jade'), 
	jshint = require('gulp-jshint'), 
	jsmin = require('gulp-jsmin'),
	minifyCss = require('gulp-minify-css'),
	notify = require('gulp-notify'), 
	sass = require('gulp-sass'), 
	uglify = require('gulp-uglify'),
	uncss = require('gulp-uncss'), 
	useref = require('gulp-useref'),
	opn = require('opn'), 
	wiredep = require('wiredep'); 

gulp.task('connect', function() {
  connect.server({
    root: 'proj',
    livereload: true
  });
  opn('http://localhost:8080/');
});

gulp.task('wiredep', function () {    
  gulp.src('proj/*.html')
    .pipe(wiredep({
        directory: 'proj/bower_components'
    }))
    .pipe(gulp.dest('proj'));
});

gulp.task('sass', function () {
    gulp.src('proj/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'))
        .pipe(notify("SCSS done!"));
});

gulp.task('autopref', function () {
    return gulp.src('proj/css/style.css')
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('proj/css'))
        .pipe(notify("autopref done!"));
});

gulp.task('comb', function () {
  return gulp.src('proj/css/style.css')
    .pipe(csscomb())
    .pipe(gulp.dest('proj/css'))
    .pipe(notify("csscomb done!"));
});

gulp.task('html', function() {
  gulp.src('proj/jade/_pages/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('proj/'))
    .pipe(notify("Jade done!"))
    .pipe(connect.reload());
});

gulp.task('uncss', function() {
    return gulp.src('proj/css/style.css')
        .pipe(uncss({
            html: glob.sync('proj/*.html')
        }))
        .pipe(notify("uncss done!"))
        .pipe(gulp.dest('proj/css/style.css'))
        .pipe(connect.reload());
});

gulp.task('jshint', function() {
  return gulp.src('proj/js/*.js')
    .pipe(jshint())
    .pipe(notify("JS done!"))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['proj/jade/_pages/*.jade'], ['html']);
  gulp.watch(['proj/scss/*.scss'], ['sass', 'autopref', 'comb', 'uncss']);
  gulp.watch(['proj/js/*.js'], ['jshint']);
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


gulp.task('default', ['connect', 'watch']);