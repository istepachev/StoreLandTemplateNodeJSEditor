import { src, dest } from "../../gulpfile.js";
import { Paths, FilesMap } from "../const.js";
import { checkBuild } from "../utils.js";
import plumber from "gulp-plumber";

async function fonts(filePath = "") {
  return src(
    checkBuild(filePath)
      ? `src/fonts/**/*.{${FilesMap.getFilesStr("fonts")}}`
      : filePath
  )
    .pipe(plumber())
    .pipe(dest(Paths.buildStatic));
}

export default fonts;
