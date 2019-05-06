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
  rename = require("gulp-rename"),
  notify = require("gulp-notify"),
  autoprefixer = require("gulp-autoprefixer"),
  pump = require('pump'),
  shell = require("gulp-shell"),
  jsStylish = require('jshint-stylish'),
  // Get data from file
  pkg = require('./package.json');

// ** Local server ** //
function serve(done) {
  browserSync.init({
    host: 'localhost',
    port: 9002,
    open: 'external',
    proxy: 'http://localhost:9002/bootstrap/',
    online: true,
    notify: false
  });
  done();
}

// ** Cleaning ** //
function cleanUp(cb) {
  del.sync([paths.dist + '/**/*', paths.docs + '/dist/**/*']);
  cb();
}

// ** Copying ** //
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

// ** Styles ** //
function styles() {
  return gulp
    .src(paths.bsLess, { sourcemaps: true })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(less())
    .pipe(concat("bootstrap.css"))
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(gulp.dest(paths.cssDest, { sourcemaps: '.' }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(paths.cssDest, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
}

function fakStyles() {
  return gulp
    .src(paths.FAKstyles, { sourcemaps: true })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(gulp.dest(paths.cssDest + '/faculties', { sourcemaps: '.' }));
}

function gridboxes() {
  return gulp
    .src(paths.gridboxStyles, { sourcemaps: true })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(gulp.dest(paths.cssDest, { sourcemaps: '.' }));
}

function docTypeStyles() {
  return gulp
    .src(paths.docTypesCss, { sourcemaps: true })
    .pipe(autoprefixer())
    .pipe(css({
      inline: ['none']
    }))
    .pipe(gulp.dest(paths.cssDest + '/doctypes', { sourcemaps: '.' }));
}

function assetsCss() {
  return gulp
    .src(paths.assetsCss, { sourcemaps: true })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(autoprefixer())
    .pipe(css())
    .pipe(rename({
      dirname: '',
      extname: '.min.css'
    }))
    .pipe(gulp.dest(paths.cssDest, { sourcemaps: '.' }));
}

// ** Scripts section ** //
function scripts() {
  return gulp
    .src(paths.jsSrc, { sourcemaps: true })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(jshint())
    .pipe(jshint.reporter(jsStylish))
    .pipe(concat("bootstrap.js"))
    .pipe(gulp.dest(paths.jsDest))
    .pipe(uglify().on('error', console.error))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(paths.jsDest, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
}

function assetsScripts() {
  return gulp
    .src(paths.assetsJS, { sourcemaps: true })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(uglify().on('error', console.error))
    .pipe(rename({
      dirname: '',
      extname: '.min.js'
    }))
    .pipe(gulp.dest(paths.jsDest, { sourcemaps: '.' }));
}

// ** Documentation HTML validation ** //
function parseHtml() {
  return gulp
    .src(paths.docsParsedHtmml)
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.failAfterError())
    .pipe(htmlhint.reporter())
    .pipe(browserSync.stream());
}

// ** Documentation styles ** //
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

function jekyll() {
  return gulp.src(paths.gh_pages + '/**/*html')
    .pipe(shell([
      'bundle exec jekyll serve'
    ]))
    .pipe(browserSync.stream());
}

// ** Watch for changes ** //
function watch() {
  gulp.watch(paths.allLessFiles, styles);
  gulp.watch(paths.assetsCss, assetsCss);
  gulp.watch(paths.FAKstyles, fakStyles);
  gulp.watch(paths.docTypesCss, docTypeStyles);
  gulp.watch(paths.gridboxStyles, gridboxes);
  gulp.watch(paths.jsSrc, scripts);
  gulp.watch(paths.assetsJS, assetsScripts);
  gulp.watch(paths.DocsCss, docsCSS);
  gulp.watch(paths.docsHtmml, parseHtml);
}

// ** Task definition ** //
gulp.task("jekyll", jekyll);
gulp.task("html", parseHtml);
gulp.task("fonts", copyFonts);
gulp.task("clean", cleanUp);
gulp.task("docs", docsCSS);
gulp.task("assets", gulp.series(assetsScripts, assetsCss));
gulp.task("js", scripts);
gulp.task("styles", gulp.series(styles, fakStyles, docTypeStyles, gridboxes));
gulp.task("copy", gulp.series(copyFonts, copyFiles));
var build = gulp.parallel("styles", "js", "assets", "fonts");
gulp.task('default', gulp.series(cleanUp, build, copyFiles, serve, watch));

// ** Export tasks ** //
exports.watch = watch;
exports.scripts = scripts;
exports.styles = styles;
exports.assetsScripts = assetsScripts;
exports.assetsCss = assetsCss;
exports.cleanUp = cleanUp;
exports.copyFiles = copyFiles;
exports.copyFonts = copyFonts;
