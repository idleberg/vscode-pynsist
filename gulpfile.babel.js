'use strict';

// Dependencies
import gulp from 'gulp';
import raster from 'gulp-raster';
import rename from 'gulp-rename';

const svgFiles = [
  './src/logo.svg'
];

// Convert SVG
gulp.task('default', (done) => {
  gulp.src(svgFiles)
    .pipe(raster())
    .pipe(rename("logo.png"))
    .pipe(gulp.dest('./images'));
  done();
});
