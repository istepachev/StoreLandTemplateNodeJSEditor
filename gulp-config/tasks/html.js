import { src, dest } from 'gulp';
import fileInclude from 'gulp-file-include';
import plumber from 'gulp-plumber';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import Config from '../const.js';
const {
  env: { isProd },
  Paths,
} = Config;
import chalk from 'chalk';

async function html(evt = '', filePath = Paths.html.default) {
  const fileName = path.basename(filePath);
  let templateParentsPaths = [];

  if (fileName.startsWith(`_`)) {
    try {
      const data = await readFile(path.resolve(filePath), {
        encoding: 'utf8',
      });

      if (!data.length) {
        console.error(chalk.redBright(`⛔ Файл ${fileName} пуст`));
        return null;
      }
      const firstStrFile = data.split('\n').shift();
      const isFirstComment = firstStrFile.match(/\[([^}]*)]/);
      if (!isFirstComment) {
        console.error(
          chalk.redBright(
            `⛔ Путь до файла/файлов родителей не указан в 1й строке. Пример: <!-- [html.htm] -->`,
          ),
        );
        return null;
      }

      templateParentsPaths = firstStrFile
        .match(/\[([^}]*)]/)[1]
        .trim()
        .split(',')
        .map((el) => `${Paths.html.src}/${el.trim()}`);
      console.log(
        chalk.gray(`Сохранение файлов\n${templateParentsPaths.join('\n')}`),
      );
    } catch (err) {
      console.error(
        chalk.redBright(`⛔ Ошибка чтения файла ${fileName}: ${err.message}`),
      );
      return null;
    }
  }

  const getCurrentPath = () => {
    if (templateParentsPaths.length) {
      return templateParentsPaths;
    }
    if (isProd) {
      return Paths.html.build;
    }
    return filePath;
  };

  const config = await getFileIncludeConfig();
  if (!config) {
    console.error(chalk.redBright('⛔ Ошибка получения конфигурации'));
    return null;
  }

  return src(getCurrentPath(), { allowEmpty: true })
    .pipe(plumber())
    .pipe(fileInclude(config))
    .pipe(dest(Paths.html.dest));
}

async function getFileIncludeConfig() {
  const defaultConfig = {
    prefix: '@@',
    basepath: '@file',
    context: {},
  };

  try {
    const jsonData = await readFile(
      new URL(`../../${Paths.htmlTemplateJsons.default}`, import.meta.url),
      {
        encoding: 'utf-8',
      },
    );
    const DEFAULT_TEMPLATE_VARIABLES = JSON.parse(jsonData);

    return {
      ...defaultConfig,
      context: DEFAULT_TEMPLATE_VARIABLES,
    };
  } catch (error) {
    console.info(
      chalk.yellowBright(`⛔ Ошибка чтения конфигурации: ${error.message}`),
    );
    return defaultConfig;
  }
}

export default html;
