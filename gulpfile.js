'use strict';
var paths = require('./paths.js'),
  gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  plumber = require('gulp-plumber'),
  // shell = require('gulp-shell'),
  del = require('del'),
  less = require('gulp-less'),
  css = require('gulp-clean-css'),
  htmlhint = require("gulp-htmlhint"),
  concat = require('gulp-concat'),
  jshint = require("gulp-jshint"),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
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
  del.sync([paths.dist + '/**/*', paths.docs + '/dist/**/*']);
  cb();
}

function copyFiles() {
  return gulp
    .src(paths.dist + '/**/*', {
      base: "."
    })
    .pipe(gulp.dest(paths.docs));
}

function copyFonts() {
  return gulp
    .src(paths.fonts + '/**/*', {
      base: "."
    })
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.dest(paths.docs + '/dist'));
}

// Compile styles
function styles() {
  return gulp
    .src(paths.bsLess)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(less())
    .pipe(concat("bootstrap.css"))
    .pipe(gulp.dest(paths.cssDest))
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(paths.cssDest))
    .pipe(browserSync.stream());
}

function fakStyles() {
  return gulp
    .src(paths.FAKstyles)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(gulp.dest(paths.cssDest + '/faculties'));
}

function docTypeStyles() {
  return gulp
    .src(paths.docTypesCss)
    .pipe(autoprefixer())
    .pipe(css({
      inline: ['none']
    }))
    .pipe(gulp.dest(paths.cssDest + '/doctypes'));
}

function assetsCss() {
  return gulp
    .src(paths.assetsCss)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(rename({
      dirname: '',
      extname: '.min.css'
    }))
    .pipe(gulp.dest(paths.cssDest));
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(paths.jsSrc)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(jshint())
    .pipe(jshint.reporter(jsStylish));
  //.pipe(jshint.reporter('fail'));
}

// Transpile, concatenate and minify scripts
function scripts() {
  return gulp
    .src(paths.jsSrc)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(babel())
    .pipe(concat("bootstrap.js"))
    .pipe(gulp.dest(paths.jsDest))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(paths.jsDest))
    .pipe(browserSync.stream());
}

function assetsScripts() {
  return gulp
    .src(paths.assetsJS)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(uglify())
    .pipe(rename({
      dirname: '',
      extname: '.min.js'
    }))
    .pipe(gulp.dest(paths.jsDest));
}

function parseHtml() {
  return gulp
    .src(paths.docsParsedHtmml)
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.failAfterError())
    .pipe(htmlhint.reporter())
    .pipe(browserSync.stream());
}

function docsCSS() {
  return gulp
    .src(paths.DocsCss)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(gulp.dest(paths.assets + '/src'))
    .pipe(browserSync.stream());
}

function watch() {
  gulp.watch(paths.allLessFiles, styles);
  gulp.watch(paths.assetsCss, assetsCss);
  gulp.watch(paths.FAKstyles, fakStyles);
  gulp.watch(paths.docTypesCss, docTypeStyles);
  gulp.watch(paths.jsSrc, gulp.series(scriptsLint, scripts));
  gulp.watch(paths.assetsJS, assetsScripts);
  gulp.watch(paths.DocsCss, docsCSS);
  gulp.watch(paths.docsHtmml, parseHtml);
}

gulp.task("html", parseHtml);
gulp.task("fonts", copyFonts);
gulp.task("clean", cleanUp);
gulp.task("docs", docsCSS);
gulp.task("assets", gulp.series(assetsScripts, assetsCss));
gulp.task("js", gulp.series(scriptsLint, scripts, copyFiles));
gulp.task("styles", gulp.series(styles, fakStyles, docTypeStyles, copyFiles));
gulp.task("copy", gulp.series(copyFiles, copyFonts));

var build = gulp.parallel("styles", "js", "assets", "fonts");
gulp.task('default', gulp.series(cleanUp, build, copyFiles, serve, watch));

// export tasks
exports.watch = watch;
exports.scripts = scripts;
exports.styles = styles;
exports.assetsScripts = assetsScripts;
exports.assetsCss = assetsCss;
exports.cleanUp = cleanUp;
exports.copyFiles = copyFiles;
exports.copyFonts = copyFonts;
