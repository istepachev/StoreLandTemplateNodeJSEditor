const { src, dest } = require("gulp");
const { Paths } = require("./constants");
const newer = require("gulp-newer");
const imagemin = require("gulp-imagemin");

const images = () =>
  src([Paths.images.src])
    .pipe(newer(Paths.images.dest))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 95, progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(Paths.buildStatic));

module.exports = images;
