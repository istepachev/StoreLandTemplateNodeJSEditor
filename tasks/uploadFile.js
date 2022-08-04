const { URLSearchParams } = require("node:url");
const { browserSync } = require("./browsersync");
const path = require("node:path");
const { URL_MAP } = require("./constants");
const fs = require("node:fs");
const fsPromises = fs.promises;

const uploadFile = (event, cb = () => {}) => {
  // console.log("event", event);
  async function getFileContent() {
    const file = event;
    const fileName = path.basename(file);

    try {
      const filehandle = await fsPromises.open(`${file}`, "r+");
      const data = await filehandle.readFile("base64");
      filehandle.close();
      return { data, fileName };
    } catch (e) {
      console.log("Error", e);
    }
  }
  getFileContent()
    .then(({ data, fileName }) => {
      const params = new URLSearchParams({
        secret_key: SECRET_KEY,
        "form[file_name]": `${fileName}`,
        "form[file_content]": `${data}`,
      });
      if (fileName.includes("css")) {
        // params.append("form[do_not_receive_file]", `1`);
      }

      fetch(URL_MAP.save, {
        method: "post",
        body: params,
        timeout: 5000,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status === `ok`) {
            console.log(
              `[${moment().format("HH:mm:ss")}] Файл ${chalk.red(
                fileName
              )} успешно отправлен ✔️`
            );
            if (!fileName.includes("css")) {
              browserSync.reload();
            }
            if (fileName.includes("css")) {
              browserSync.reload("*.css");
            }
            if (typeof cb === "function") {
              cb();
            }
          } else if (json.status === `error`) {
            console.log(
              chalk.redBright(`Ошибка отправки ⛔ ${chalk.gray(fileName)}`),
              chalk.redBright(`${json.message}`)
            );
          }
        });
    })
    .catch(console.error);
};

module.exports = uploadFile;
