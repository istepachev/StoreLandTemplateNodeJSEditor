import { src, dest } from "../../gulpfile.js";
import fileinclude from "gulp-file-include";
import plumber from "gulp-plumber";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { Paths } from "../const.js";
import { checkBuild } from "../utils.js";
import chalk from "chalk";

async function html(evt, filePath = Paths.html.default) {
  const isBuild = checkBuild(evt);
  const fileName = path.basename(filePath);
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
  const config = await getFileIncludeConfig();

  return src(getCurrentPath(), { allowEmpty: true })
    .pipe(plumber())
    .pipe(fileinclude(config))
    .pipe(dest(Paths.html.dest));
}

async function getFileIncludeConfig() {
  try {
    const jsonData = await readFile(
      new URL(`../../${Paths.htmlTemplateJsonDefault}`, import.meta.url),
      {
        encoding: "utf-8",
      }
    );
    const DEFAULT_TEMPLATE_VARIABLES = JSON.parse(jsonData);

    return {
      prefix: "@@",
      basepath: "@file",
      context: DEFAULT_TEMPLATE_VARIABLES,
    };
  } catch (error) {
    console.error(error);
  }
}

export default html;
