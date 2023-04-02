import path from "node:path";
import fs from "node:fs/promises";
import chalk from "chalk";
import dayjs from "dayjs";
import { URL_MAP } from "../const.js";
import { browserSync } from "./browsersync.js";
import { SECRET_KEY } from "./config-check.js";
import got from "got";
import { FormData } from "formdata-node";

//TODO добавить debounce на двойное сохранение
async function uploadFile(evt, filePath) {
  try {
    const fileName = path.basename(filePath);
    const fileHandle = await fs.open(`${filePath}`, "r+");
    const fileData = await fileHandle.readFile("base64");
    await fileHandle.close();

    const formData = new FormData();
    formData.append("secret_key", SECRET_KEY);
    formData.append("form[file_name]", fileName);
    formData.append("form[file_content]", fileData);

    const json = await got
      .post(URL_MAP.save, {
        body: formData,
        timeout: {
          send: 5000,
        },
      })
      .json();

    if (json.status === `ok`) {
      console.log(
        `[${dayjs().format("HH:mm:ss")}][${evt}] Файл ${chalk.red(
          fileName
        )} успешно отправлен ${chalk.greenBright("✔️")}`
      );

      if (fileName.includes("css")) {
        browserSync.reload("*.css");

        return;
      }
      browserSync.reload();
    } else if (json.status === `error`) {
      console.log(
        `Ошибка отправки ⛔ ${fileName}: ${chalk.redBright(json.message)}`
      );
    }
  } catch (e) {
    console.error("Error", e);
  }
}

export default uploadFile;
