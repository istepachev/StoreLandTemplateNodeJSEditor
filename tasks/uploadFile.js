import { URLSearchParams } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import fetch from "node-fetch";
import chalk from "chalk";
import dayjs from "dayjs";
import { URL_MAP } from "./constants.js";
import { browserSync } from "./browsersync.js";
import { SECRET_KEY } from "./config-check.js";

async function getFileContent(file) {
  const fileName = path.basename(file);

  try {
    const filehandle = await fs.open(`${file}`, "r+");
    const data = await filehandle.readFile("base64");
    filehandle.close();
    return { data, fileName };
  } catch (e) {
    console.log("Error", e);
  }
}
function uploadFile(event, cb = () => {}) {
  getFileContent(event)
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
              `[${dayjs().format("HH:mm:ss")}] Файл ${chalk.red(
                fileName
              )} успешно отправлен ${chalk.greenBright("✔️")}`
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
              `Ошибка отправки ⛔ ${fileName}: ${chalk.redBright(json.message)}`
            );
          }
        });
    })
    .catch(console.error);
}

export default uploadFile;
