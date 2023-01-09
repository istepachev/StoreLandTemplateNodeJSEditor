import { src, dest } from "../../gulpfile.js";
import DEFAULT_TEMPLATE_VARIABLES from "../../src/html/_template-variables.js";
import fileinclude from "gulp-file-include";
import replacePath from "gulp-replace-path";
import plumber from "gulp-plumber";
import path from "node:path";
import fs from "node:fs";
import { Paths } from "../const.js";
import { isBuild as build } from "../utils.js";
import chalk from "chalk";
// import { deleteSync } from "del";

const FILEINCLUDE_CONFIG = {
  prefix: "@@",
  basepath: "@file",
  context: DEFAULT_TEMPLATE_VARIABLES,
};

function html(_, filePath) {
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
      // deleteSync.sync(Paths.html.dest, { force: true });

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
}

export default html;
