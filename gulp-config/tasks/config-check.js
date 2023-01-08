import {
  CURRENT_SITE,
  FILE_CONFIG_NAME,
  FILE_CURRENT_SITE_NAME,
} from "../const.js";
import { readFileSync, writeFileSync } from "node:fs";
import chalk from "chalk";

const createSecretFile = (siteUrl = "", fileName = "") => {
  const fileContent = `{
  "${siteUrl}": {
    "SECRET_KEY": ""
  },
  "": {
    "SECRET_KEY": ""
  }
}`;

  writeFileSync(fileName, fileContent);
};

let SECRET_KEY;

async function checkConfig() {
  if (!CURRENT_SITE) {
    console.error(
      `⛔ Не задан url адрес ${chalk.red(`CURRENT_SITE`)} в файле ${chalk.red(
        FILE_CURRENT_SITE_NAME
      )}`
    );
  }
  try {
    const data = JSON.parse(
      readFileSync(new URL(`../../${FILE_CONFIG_NAME}`, import.meta.url))
    )[CURRENT_SITE];
    SECRET_KEY = data.SECRET_KEY;
  } catch (error) {
    createSecretFile(CURRENT_SITE, FILE_CONFIG_NAME);
  }
  if (!SECRET_KEY) {
    console.error(
      `⛔ Не задан ${chalk.red(`SECRET_KEY`)} в файле ${chalk.red(
        FILE_CONFIG_NAME
      )} для ${chalk.gray(CURRENT_SITE)}`
    );
  }

  if (SECRET_KEY && CURRENT_SITE) {
    console.log(chalk.greenBright(`✔️  Конфиг задан верно.`));
  }
}

export { checkConfig, SECRET_KEY };
