const fs = require("fs");

const { CURRENT_SITE } = require("./current-site.json"); // Текущий url адрес сайта, с которым работаем
const FILE_CONFIG_NAME = "secret-keys.json";

const fileContent = `{
    "${CURRENT_SITE}": {
        "SECRET_KEY": ""
    },
    "": {
        "SECRET_KEY": ""
    }
}
`;

const createSecretFile = () => {
  fs.writeFileSync(FILE_CONFIG_NAME, fileContent);
};

createSecretFile();
