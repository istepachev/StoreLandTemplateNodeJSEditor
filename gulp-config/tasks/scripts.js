import { src, dest } from "../../gulpfile.js";
import path from "node:path";
import { Paths } from "../const.js";
import { checkBuild } from "../utils.js";
import replacePath from "gulp-replace-path";
import plumber from "gulp-plumber";
// import babel from "gulp-babel");

const DEFAULT_JS_PATH_NAME = `default`;

async function scripts(_, filePath = _) {
  const isBuild = checkBuild(filePath);
  const fileName = !isBuild ? path.basename(filePath) : "";
  const parentFileFolderName = !isBuild
    ? path.basename(path.dirname(filePath))
    : "";

  if (fileName.startsWith(`_`)) {
    console.log(`Файл ${fileName} сохранен, перезагрузи сборку`);
    return;
  }
  if (parentFileFolderName === DEFAULT_JS_PATH_NAME) {
    src([filePath]).pipe(dest(Paths.buildStatic));

    return;
  }
  const PATH = !isBuild
    ? filePath
    : ["src/js/**/*.js", `src/js/${DEFAULT_JS_PATH_NAME}/**/*.js`];
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
      .pipe(dest(Paths.buildStatic))
  );
}

export default scripts;
