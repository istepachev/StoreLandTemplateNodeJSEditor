const { src, dest } = require("gulp");
const DEFAULT_TEMPLATE_VARIABLES = require("../src/html/_template-variables");
const fileinclude = require("gulp-file-include");
const replacePath = require("gulp-replace-path");
const plumber = require("gulp-plumber");
const path = require("node:path");
const fs = require("node:fs");
const { Paths } = require("./constants");
const { isBuild: build } = require("./utils");
const chalk = require("chalk");
const del = require("del");

const FILEINCLUDE_CONFIG = {
  prefix: "@@",
  basepath: "@file",
  context: DEFAULT_TEMPLATE_VARIABLES,
};
const htmlinclude = (filePath = "") => {
  const isBuild = build(filePath);
  const file = !isBuild && filePath;
  const fileName = !isBuild ? path.basename(filePath) : "";

  if (!isBuild && file && fileName.startsWith(`_`)) {
    fs.readFile(`${file}`, { encoding: "utf8" }, (err, data) => {
      if (err) throw err;

      if (!data.length) {
        console.error(chalk.redBright(`⛔ Файл ${fileName} пуст`));

        return;
      }
      const firstStrFile = data.split("\n").shift();
      const isFirstComment = firstStrFile.match(/\[([^}]*)]/);
      if (!isFirstComment) {
        console.error(
          chalk.redBright(
            `⛔ Путь до файла/файлов родителей не указан в 1й строке. Пример: <!-- [html.htm] -->`
          )
        );

        return;
      }

      const filesPath = firstStrFile
        .match(/\[([^}]*)]/)[1]
        .trim()
        .split(",")
        .map((el) => `${Paths.html.src}/${el.trim()}`);
      console.log(chalk.gray(`Сохранение файлов ${filesPath.join()}`));
      // del.sync(Paths.html.dest, { force: true });

      return (
        src(filesPath, { allowEmpty: true })
          .pipe(plumber())
          .pipe(fileinclude(FILEINCLUDE_CONFIG))
          // .pipe(replacePath("/src/html/", ""))
          .pipe(dest(Paths.html.dest))
      );
    });
  } else {
    const PATH = !isBuild
      ? filePath
      : ["src/html/**/*.htm", "!src/html/_templates/**/*.{html, htm}"];

    return src(PATH)
      .pipe(plumber())
      .pipe(fileinclude(FILEINCLUDE_CONFIG))
      .pipe(replacePath("/src/html/", ""))
      .pipe(dest(Paths.html.dest));
  }
};

module.exports = htmlinclude;
