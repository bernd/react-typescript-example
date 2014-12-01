'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var react = require('gulp-react');
var less = require('gulp-less');
var watchLess = require('gulp-watch-less');
var del = require('del');
var path = require('path');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

var reactOptions = {harmony: true, es6: true, stripTypes: true};
var lessOptions = {paths: ['./node_modules'], compress: true};

function browserifyBundler() {
  return browserify({
    entries: ['./src/app.jsx'],
    extensions: ['.jsx', '.js'],
    transform: [
      ['reactify', reactOptions]
    ],
    debug: false,
    cache: {},
    packageCache: {},
    fullPaths: false
  })
  .plugin('tsify', {noImplicitAny: false});
}

function browserifyBundle(bundler) {
  return bundler.bundle()
    .on('error', function (error) {
      gutil.log(error);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist'));
}

function buildCss(watch) {
  var file = './src/style.less';
  var css = gulp.src(file)

  if (watch) {
    css = css.pipe(watchLess(file, {name: 'LESS', less: lessOptions}));
  }

  return css.pipe(less(lessOptions))
    .pipe(gulp.dest('dist'))
    .on('error', function (error) {
      gutil.log(error);
      this.emit('end');
    });
}

gulp.task('default', ['clean', 'build']);

gulp.task('build', ['build:browserify', 'build:less']);

gulp.task('build:browserify', function () {
  return browserifyBundle(browserifyBundler());
});

gulp.task('build:less', function () {
  return buildCss();
});

// Only needed for the lint task. The prod js file will be built with browserify.
gulp.task('build:jsx', function() {
  return gulp.src('src/**/*.jsx')
    .pipe(react(reactOptions))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  var css = buildCss(true);
  var bundler = watchify(browserifyBundler());

  bundler.on('update', function () {
    gutil.log('JS updated');
    return browserifyBundle(bundler);
  });

  return browserifyBundle(bundler);
});

gulp.task('clean', function () {
  del(['dist/*']);
});

gulp.task('lint', ['clean', 'build:jsx'], function () {
  return gulp.src(['dist/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {verbose: true}));
});
