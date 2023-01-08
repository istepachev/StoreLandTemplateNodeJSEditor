import {
  FilesMap,
  preprocessorOn,
  preprocessor,
  BASE_DIR,
  DIST_DIR,
} from "../const.js";

import {
  fonts,
  scripts,
  styles,
  html,
  images,
  icons,
  uploadFile,
  watch,
} from "../../gulpfile.js";

function startwatch() {
  // Стили
  const pathStyleFiles = preprocessorOn
    ? `${BASE_DIR}/${preprocessor}/**/*.${preprocessor}`
    : `${BASE_DIR}/css/**/*.css`;

  watch(pathStyleFiles).on("add", styles).on("change", styles);
  watch(`${DIST_DIR}/**/*.css`).on("add", uploadFile).on("change", uploadFile);
  // Изображения
  watch(`${DIST_DIR}/**/*.{${FilesMap.getFilesStr("images")}}`)
    .on("add", uploadFile)
    .on("change", uploadFile);
  // Svg иконки
  watch(`${BASE_DIR}/icons/**/*.${FilesMap.getFilesStr("icons")}`)
    .on("add", icons)
    .on("change", icons);
  // Шрифты
  watch(`${DIST_DIR}/**/*.{${FilesMap.getFilesStr("fonts")}}`)
    .on("add", uploadFile)
    .on("change", uploadFile);
  watch(`${BASE_DIR}/**/*.{${FilesMap.getFilesStr("fonts")}}`).on(
    "change",
    fonts
  );
  // Html
  watch(`${BASE_DIR}/**/*.{${FilesMap.getFilesStr("html")}}`).on(
    "change",
    html
  );

  watch(`${DIST_DIR}/**/*.{${FilesMap.getFilesStr("html")}}`)
    .on("change", uploadFile)
    .on("add", uploadFile);

  // Javascript
  watch(`${BASE_DIR}/**/*.${FilesMap.getFilesStr("js")}`)
    .on("change", scripts)
    .on("add", scripts);

  watch(`${DIST_DIR}/**/*.${FilesMap.getFilesStr("js")}`)
    .on("change", uploadFile)
    .on("add", uploadFile);
}

export default startwatch;
