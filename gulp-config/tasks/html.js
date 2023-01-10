import { src, dest } from "../../gulpfile.js";
import DEFAULT_TEMPLATE_VARIABLES from "../../src/html/_template-variables.js";
import fileinclude from "gulp-file-include";
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

async function html(evt, filePath) {
  const isBuild = checkBuild(evt);
  const fileName = !isBuild ? path.basename(filePath) : "";
  let templateParentsPaths = [];

  if (fileName.startsWith(`_`)) {
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

      templateParentsPaths = firstStrFile
        .match(/\[([^}]*)]/)[1]
        .trim()
        .split(",")
        .map((el) => `${Paths.html.src}/${el.trim()}`);
      console.log(
        chalk.gray(`Сохранение файлов\n${templateParentsPaths.join("\n")}`)
      );
    } catch (err) {
      console.error(err.message);
    }
  }
  const getCurrentPath = () => {
    if (templateParentsPaths.length) {
      return templateParentsPaths;
    }

    if (isBuild) {
      return Paths.html.build;
    }

    return filePath;
  };

  return src(getCurrentPath(), { allowEmpty: true })
    .pipe(plumber())
    .pipe(fileinclude(FILEINCLUDE_CONFIG))
    .pipe(dest(Paths.html.dest));
}

export default html;
