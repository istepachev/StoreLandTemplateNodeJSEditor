import { src, dest } from "../../gulpfile.js";
import { Paths } from "../const.js";
import { checkBuild } from "../utils.js";
import plumber from "gulp-plumber";

async function fonts(filePath = "") {
  const isBuild = checkBuild(filePath);

  return src(isBuild ? Paths.fonts.watch : filePath)
    .pipe(plumber())
    .pipe(dest(Paths.fonts.dest));
}

export default fonts;
