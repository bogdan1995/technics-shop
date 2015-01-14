"use strict";

var
    gulp = require('gulp'),
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
    wiredep = require('wiredep').stream,
    connect = require('gulp-connect'),
    compass = require('gulp-compass'),
    prettify = require('gulp-html-prettify');

gulp.task('connect', function () {
    connect.server({
        root: 'proj',
        livereload: true,
        port: 8000
    });
    opn('http://localhost:8000/');
});

gulp.task('css', function() {
    gulp.src('proj/scss/**/*.scss')
        .pipe(compass({
            css: 'proj/css',
            sass: 'proj/scss',
            require: ['compass']
        }))
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('proj/css'))
        .pipe(connect.reload())
        .pipe(notify("SCSS done!"));
});

gulp.task('jade', function () {
    gulp.src('./proj/jade/_pages/*.jade')
        .pipe(jade())
        .pipe(prettify({indent_char: ' ', indent_size: 2}))
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

gulp.task('jshint', function () {
    return gulp.src('./proj/js/*.js')
        .pipe(jshint())
        .pipe(connect.reload())
        .pipe(notify("JS done!"));

});

gulp.task('wiredep', function () {
    gulp.src('proj/*.html')
        .pipe(wiredep({
            directory: 'proj/bower_components'
        }))
        .pipe(connect.reload())
        .pipe(notify("wiredep done!"))
        .pipe(gulp.dest('./proj'));

});

gulp.task('watch', function () {
    gulp.watch(['./proj/jade/_pages/*.jade'], ['jade']);
    gulp.watch(['./proj/scss/**/*.scss'], ['css']);
    gulp.watch(['./proj/js/*.js'], ['jshint']);
    gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('build', function () {
    var assets = useref.assets();
    return gulp.src('proj/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(clean());
});


gulp.task('default', ['connect', 'watch']);