'use strict';
var paths = require('./paths.js'),
  gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  plumber = require('gulp-plumber'),
  del = require('del'),
  less = require('gulp-less'),
  css = require('gulp-clean-css'),
  htmlhint = require("gulp-htmlhint"),
  concat = require('gulp-concat'),
  jshint = require("gulp-jshint"),
  uglify = require('gulp-uglify'),
  babel  = require('gulp-babel'),
  rename = require("gulp-rename"),
  notify = require("gulp-notify"),
  autoprefixer = require("gulp-autoprefixer"),
  pump = require('pump'),
  jsStylish = require('jshint-stylish'),
  svgmin = require('gulp-svgmin'),
  // Get data from file
  pkg = require('./package.json');


function serve(done) {
  browserSync.init({
    host: 'localhost',
    port: 9001,
    open: 'external',
    proxy: 'http://localhost:9001/bootstrap/',
    online: true,
    notify: false
  });
  done();
}

// Clean build folder function:
function cleanUp(cb) {
    del.sync([paths.dist + '/**/*' , paths.docs + '/dist/**/*']);
    cb();
}
function copyFiles() {
  return gulp
    .src(paths.dist + '/**/*', {base: "."})
    .pipe(gulp.dest(paths.docs));
}

function copyFonts() {
  return gulp
    .src(paths.fonts + '/**/*', {base: "."})
    .pipe(gulp.dest(paths.docs + '/dist'));
}

// Compile styles
function styles() {
  return gulp
    .src(paths.bsLess)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(concat("bootstrap.min.css"))
    .pipe(gulp.dest(paths.cssDest))
    .pipe(browserSync.stream());
}

function fakStyles() {
  return gulp
    .src(paths.FAKstyles)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(gulp.dest(paths.dist + '/css/faculties'))
    .pipe(browserSync.stream());
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(paths.jsSrc)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(jsStylish));
  //.pipe(jshint.reporter('fail'));
}

// Transpile, concatenate and minify scripts
function scripts() {
  return gulp
    .src(paths.jsSrc)
    .pipe(plumber())
    .pipe(concat("bootstrap.min.js"))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.jsDest))
    .pipe(browserSync.stream());
}

function html() {
  return gulp
    .src(paths.gh_pages)
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());
}

function docsCSS() {
  return gulp
    .src(paths.DocsCss)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(gulp.dest(paths.assets + '/src'))
    .pipe(browserSync.stream());
}

function watch() {
  gulp
    .watch(paths.DocsCss, docsCSS)
    .on("change", reload);
  gulp
    .watch(paths.allLessFiles,  gulp.series(styles, fakStyles))
    .on("change", reload);
  gulp
    .watch(paths.jsSrc, gulp.series(scriptsLint, scripts))
    .on("change", reload);
  // gulp
  //   .watch(paths.html, renderHtml)
  //   .on("change", reload);
}

gulp.task("clean", cleanUp);
gulp.task("docs", docsCSS);
gulp.task("js", gulp.series(scriptsLint, scripts, copyFiles));
gulp.task("styles", gulp.series(styles, fakStyles, copyFiles));
gulp.task("copy", gulp.series(copyFiles, copyFonts));

var build = gulp.parallel(cleanUp, "styles", "js");
gulp.task('default', gulp.series(serve, watch, build, copyFiles, copyFonts));

exports.watch = watch;
