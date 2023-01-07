import { CURRENT_SITE, FILE_CONFIG_NAME } from "./constants.js";
import { readFile, writeFile } from "node:fs/promises";
import chalk from "chalk";

const createSecretFile = async (siteUrl = "", fileName = "") => {
  const fileContent = `{
  "${siteUrl}": {
    "SECRET_KEY": ""
  },
  "": {
    "SECRET_KEY": ""
  }
}`;

  await writeFile(fileName, fileContent);
};
try {
  await readFile(new URL(`../${FILE_CONFIG_NAME}`, import.meta.url));
} catch (error) {
  createSecretFile(CURRENT_SITE, FILE_CONFIG_NAME);
}

const { SECRET_KEY } = JSON.parse(
  await readFile(new URL(`../${FILE_CONFIG_NAME}`, import.meta.url))
)[CURRENT_SITE];

const checkConfig = (cb) => {
  if (!CURRENT_SITE) {
    cb(
      new Error(
        `Не задан url адрес ${chalk.red(`CURRENT_SITE`)} в файле ${chalk.red(
          `current-site.json`
        )}`
      )
    );
  }
  if (!SECRET_KEY) {
    cb(
      new Error(
        `Не задан ${chalk.red(`SECRET_KEY`)} в файле ${chalk.red(
          FILE_CONFIG_NAME
        )} для ${chalk.gray(CURRENT_SITE)}`
      )
    );
  }

  cb();
};

export { checkConfig, SECRET_KEY };
