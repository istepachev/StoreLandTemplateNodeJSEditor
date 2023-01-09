import { src, dest } from "../../gulpfile.js";
import path from "node:path";
import { Paths, DEFAULT_FOLDER_NAME } from "../const.js";
import { checkBuild } from "../utils.js";
import replacePath from "gulp-replace-path";
import plumber from "gulp-plumber";
// import babel from "gulp-babel");

async function scripts(evt, filePath) {
  const isBuild = checkBuild(evt);
  const fileName = !isBuild ? path.basename(filePath) : "";
  const parentFileFolderName = !isBuild
    ? path.basename(path.dirname(filePath))
    : "";

  if (fileName.startsWith(`_`)) {
    console.log(`Файл ${fileName} сохранен, перезагрузи сборку`);
    return;
  }
  if (parentFileFolderName === DEFAULT_FOLDER_NAME) {
    src([filePath]).pipe(dest(Paths.scripts.dest));

    return;
  }
  const PATH = isBuild ? Paths.scripts.build : filePath;
  console.log(PATH);

  return (
    src(PATH)
      .pipe(plumber())
      // .pipe(
      //   babel({
      //     presets: ["@babel/env"],
      //   })
      // )
      .pipe(replacePath("/src/js/", ""))
      .pipe(replacePath("src/js/", ""))
      .pipe(replacePath("src/js", ""))
      .pipe(dest(Paths.scripts.dest))
  );
}

export default scripts;
