const path = require('path')
const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const cssWrap = require('gulp-css-wrap')

const prefix = '.theme-purple'

function css (done) {
  gulp.src(path.resolve('../src/theme/index.css'))
    .pipe(cssWrap({ selector: prefix }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('../lib'))
  done()
}

exports.default = gulp.series(css)
