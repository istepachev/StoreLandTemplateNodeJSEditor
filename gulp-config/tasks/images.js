import { src, dest } from "../../gulpfile.js";
import { Paths } from "../const.js";
import newer from "gulp-newer";
import imagemin from "gulp-imagemin";

function images() {
  return src([Paths.images.src])
    .pipe(newer(Paths.buildStatic))
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
}

export default images;
