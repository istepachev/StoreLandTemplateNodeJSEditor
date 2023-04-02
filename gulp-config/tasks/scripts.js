import { src, dest } from "../../gulpfile.js";
import path from "node:path";
import {Paths, DEFAULT_FOLDER_NAME, IS_BUILD} from "../const.js";
import plumber from "gulp-plumber";
import babel from "gulp-babel";

async function scripts(evt, filePath = "") {
  const parentFileFolderName = path.basename(path.dirname(filePath));

  if (parentFileFolderName === DEFAULT_FOLDER_NAME) {
    src(filePath).pipe(dest(Paths.scripts.dest));

    return;
  }
  const PATH = IS_BUILD ? Paths.scripts.build : filePath;

  src(PATH)
    .pipe(plumber())
    // .pipe(
    //   babel({
    //     presets: ["@babel/env"],
    //   })
    // )
    .pipe(dest(Paths.scripts.dest));
}

export default scripts;
