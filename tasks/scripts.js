const { src, dest } = require("gulp");
const { isBuild: build } = require("./utils");
const replacePath = require("gulp-replace-path");
const plumber = require("gulp-plumber");
// const babel = require("gulp-babel");

const scripts = (filePath = "") => {
  const isBuild = build(filePath);
  const fileName = !isBuild ? path.basename(filePath) : "";
  const parentFileFolderName = !isBuild
    ? path.basename(path.dirname(filePath))
    : "";
  const DEFAULT_JS_PATH_NAME = `default`;

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
};

module.exports = scripts;
