import { src, dest } from "../../gulpfile.js";
import { Paths } from "../const.js";
import { isBuild } from "../utils.js";

function fonts(filePath = "") {
  return src(
    isBuild(filePath)
      ? `src/fonts/**/*.{${Paths.getFilesStr("fonts")}}`
      : filePath
  )
    .pipe(plumber())
    .pipe(dest(Paths.buildStatic));
}

export default fonts;
