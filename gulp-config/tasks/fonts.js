import { src, dest } from "../../gulpfile.js";
import { Paths } from "../const.js";
import { checkBuild } from "../utils.js";

async function fonts(filePath = "") {
  return src(
    checkBuild(filePath)
      ? `src/fonts/**/*.{${Paths.getFilesStr("fonts")}}`
      : filePath
  )
    .pipe(plumber())
    .pipe(dest(Paths.buildStatic));
}

export default fonts;
