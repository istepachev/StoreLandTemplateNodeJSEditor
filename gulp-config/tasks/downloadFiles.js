import { Paths, FilesMap, URL_MAP } from "../const.js";
import { SECRET_KEY } from "./config-check.js";
import * as fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import got from "got";
import { FormData } from "formdata-node";
import { deleteSync } from "del";

async function downloadFiles() {
  const FILES_PATH = `${Paths.downloadDir}`;
  deleteSync(FILES_PATH);

  if (!fs.existsSync(FILES_PATH)) {
    fs.mkdirSync(FILES_PATH);
  }

  const formData = new FormData();
  formData.append("secret_key", SECRET_KEY);

  const OPTIONS = {
    body: formData,
    timeout: {
      send: 10000,
    },
  };

  async function getFiles() {
    const jsonFiles = await got.post(URL_MAP.get_list, OPTIONS).json();
    const files = jsonFiles.data.map(({ file_id, file_name }) => ({
      file_id: file_id.value,
      file_name: file_name.value,
    }));

    console.log(
      chalk.greenBright(
        `Загружен список всех файлов ✔️\nВсего файлов ${files.length} шт.`
      )
    );

    return files;
  }
  const files = await getFiles();
  const filesLength = files.length;

  getFile(files);

  async function getFile(filesArray, count = 1) {
    if (!filesArray.length) {
      console.log(`Всего скачано файлов ${count} из ${filesLength}`);

      return;
    }

    const { file_id, file_name } = filesArray.shift();

    try {
      const jsonFile = await got
        .post(`${URL_MAP.get_file}/${file_id}`, OPTIONS)
        .json();

      if (jsonFile.status === "error") {
        console.log(chalk.redBright(`Ошибка загрузки ⛔: ${jsonFile.message}`));
      }

      const file = jsonFile["data"]["file_name"].value;
      const fileContent = jsonFile["data"]["file_content"].value;
      const fileExt = path.extname(file).replace(".", "");

      const fileDirName =
        Object.keys(FilesMap).find((key) => FilesMap[key].includes(fileExt)) ||
        "";
      const newDir = `${FILES_PATH}/${fileDirName}`;

      !fs.existsSync(newDir) && fs.mkdirSync(newDir);

      fs.writeFile(`${newDir}/${file}`, fileContent, "base64", (err) => {
        if (err) {
          console.error(err);
        }

        console.log(
          `Скачан файл ${chalk.greenBright(
            file_name
          )}. Всего ${count} из ${filesLength}`
        );
        if (filesArray.length) {
          count++;
        }
        getFile(filesArray, count);
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default downloadFiles;
