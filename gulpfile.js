const {src, dest, series, parallel} = require('gulp');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');

const babel = require('gulp-babel');

const gulpUglify = require('gulp-uglify');


function htmlTask() {
  return src('src/*.html')
    .pipe(dest('dist'))
}

function styleTask() {
  return src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write())
    .pipe(concat('all.css'))
    .pipe(dest('dist/css'))
}

function scriptTask() {
  return src('src/js/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulpUglify())
    .pipe(concat('all.js'))

    .pipe(dest('dist/js'))
}

function imageTask() {
  return src('src/images/*png')
    .pipe(imagemin())
    .pipe(dest('dist/img'))
}


exports.images = imageTask;
exports.html = htmlTask;
exports.scripts = scriptTask;
exports.styles = styleTask;

exports.default = series(htmlTask, imageTask, styleTask, scriptTask);