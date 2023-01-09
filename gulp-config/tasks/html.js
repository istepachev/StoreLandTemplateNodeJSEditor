import { src, dest } from "../../gulpfile.js";
import DEFAULT_TEMPLATE_VARIABLES from "../../src/html/_template-variables.js";
import fileinclude from "gulp-file-include";
import replacePath from "gulp-replace-path";
import plumber from "gulp-plumber";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { Paths } from "../const.js";
import { checkBuild } from "../utils.js";
import chalk from "chalk";
// import { deleteSync } from "del";

const FILEINCLUDE_CONFIG = {
  prefix: "@@",
  basepath: "@file",
  context: DEFAULT_TEMPLATE_VARIABLES,
};

async function html(evt, filePath = "") {
  const isBuild = checkBuild(evt);
  const fileName = !isBuild ? path.basename(filePath) : "";
  let filesPath = [];

  if (!isBuild && filePath && fileName.startsWith(`_`)) {
    try {
      const data = await readFile(path.resolve(filePath), {
        encoding: "utf8",
      });

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

      filesPath = firstStrFile
        .match(/\[([^}]*)]/)[1]
        .trim()
        .split(",")
        .map((el) => `${Paths.html.src}/${el.trim()}`);
      console.log(chalk.gray(`Сохранение файлов ${filesPath.join()}`));
    } catch (err) {
      console.error(err.message);
    }
  }

  let currentPath;

  if (isBuild) {
    currentPath = [
      "src/html/**/*.htm",
      "!src/html/_templates/**/*.{html, htm}",
    ];
  } else if (filesPath.length) {
    currentPath = filesPath;
  } else {
    currentPath = filePath;
  }
  
  return src(currentPath, { allowEmpty: true })
    .pipe(plumber())
    .pipe(fileinclude(FILEINCLUDE_CONFIG))
    .pipe(replacePath("/src/html/", ""))
    .pipe(dest(Paths.html.dest));
}

export default html;
