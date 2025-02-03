import { src, dest } from "gulp";
import Config from "../const.js";
const { Paths } = Config;
import plumber from "gulp-plumber";
import newer from "gulp-newer";

async function fonts() {
  return src(Paths.fonts.watch)
    .pipe(plumber())
    .pipe(newer(Paths.fonts.dest))
    .pipe(dest(Paths.fonts.dest));
}

export default fonts;
