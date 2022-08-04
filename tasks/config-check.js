const { CURRENT_SITE, FILE_CONFIG_NAME } = require("./constants");
const fs = require("fs");
const chalk = require("chalk");

const createSecretFile = (siteUrl = "", fileName = "") => {
  const fileContent = `{
  "${siteUrl}": {
    "SECRET_KEY": ""
  },
  "": {
    "SECRET_KEY": ""
  }
}`;

  fs.writeFileSync(fileName, fileContent);
};
try {
  require(`../${FILE_CONFIG_NAME}`);
} catch (error) {
  createSecretFile(CURRENT_SITE, FILE_CONFIG_NAME);
}

const { SECRET_KEY } = require(`../${FILE_CONFIG_NAME}`)[CURRENT_SITE];

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

module.exports = { checkConfig, SECRET_KEY };
