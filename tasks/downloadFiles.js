import { Paths, FilesMap, URL_MAP } from "./constants.js";
import { SECRET_KEY } from "./config-check.js";
import { URLSearchParams } from "node:url";
import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import chalk from "chalk";

function downloadFiles(done) {
  const FILES_PATH = `${Paths.downloadDir}`;
  const FETCH_PARAMS = {
    method: "post",
    body: new URLSearchParams({ secret_key: SECRET_KEY }),
    timeout: 10000,
  };

  fetch(URL_MAP.get_list, FETCH_PARAMS)
    .then((res) => res.json())
    .then((json) => {
      if (json.status === `ok`) {
        console.log(chalk.greenBright(`Загружен список всех файлов ✔️`));
        if (!fs.existsSync(FILES_PATH)) {
          fs.mkdirSync(FILES_PATH);
        }
        return json.data.map((item) => ({
          file_id: item["file_id"]["value"],
          file_name: item["file_name"]["value"],
        }));
      } else if (json.status === `error`) {
        console.log(chalk.redBright(`Ошибка загрузки списка файлов ⛔`));
      }
    })
    .then((array) => {
      const arrLength = array.length;
      let count = 1;
      console.log(chalk.greenBright(`Всего файлов ${arrLength} шт.`));

      const getFile = (filesArray) => {
        if (!filesArray.length) {
          console.log(`Всего скачано файлов ${count} из ${arrLength}`);
          done();

          return;
        }
        const { file_id, file_name } = filesArray.shift();

        fetch(`${URL_MAP.get_file}/${file_id}`, FETCH_PARAMS)
          .then((res) => res.json())
          .then((json) => {
            if (json.status === `ok`) {
              const file = json["data"]["file_name"].value;
              const fileContent = json["data"]["file_content"].value;
              const fileExt = path.extname(file).replace(".", "");

              const fileDirName =
                Object.keys(FilesMap).find((key) =>
                  FilesMap[key].includes(fileExt)
                ) || "";
              const newDir = `${FILES_PATH}/${fileDirName}`;

              !fs.existsSync(newDir) && fs.mkdirSync(newDir);

              fs.writeFile(
                `${newDir}/${file}`,
                fileContent,
                "base64",
                (err) => {
                  if (err) {
                    console.log(err);
                  }

                  console.log(
                    `Скачан файл ${chalk.gray(
                      file_name
                    )}. Всего ${count} из ${arrLength}`
                  );
                  if (filesArray.length) {
                    count++;
                  }
                  getFile(array);
                }
              );
            } else if (json.status === `error`) {
              console.log(
                chalk.redBright(`Ошибка загрузки⛔: ${json.message}`)
              );
            }
          })
          .catch(console.log);
      };
      getFile(array);
    });
}

export default downloadFiles;
