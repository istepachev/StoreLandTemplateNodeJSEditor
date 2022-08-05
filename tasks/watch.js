const {
  FilesMap,
  preprocessorOn,
  preprocessor,
  BASE_DIR,
  DIST_DIR,
} = require("./constants");
const { watch, parallel } = require("gulp");

exports.browserSync = require("./browsersync").browsersyncTask;
exports.fonts = require("./fonts");
exports.scripts = require("./scripts");
exports.styles = require("./styles");
exports.cleanDist = require("./clean");
exports.html = require("./html");
exports.images = require("./images");
exports.icons = require("./icons");
exports.checkConfig = require("./config-check").checkConfig;
exports.downloadFiles = require("./downloadFiles");
exports.uploadFile = require("./uploadFile");
exports.startwatch = require("./watch");

const startwatch = () => {
  // Стили
  const pathStyleFiles = preprocessorOn
    ? `${BASE_DIR}/${preprocessor}/**/*.${preprocessor}`
    : `${BASE_DIR}/css/**/*.css`;

  watch(pathStyleFiles)
    .on("add", parallel("styles"))
    .on("change", parallel("styles"));
  watch(`${DIST_DIR}/**/*.css`)
    .on("add", parallel("uploadFile"))
    .on("change", parallel("uploadFile"));
  // Изображения
  watch(`${DIST_DIR}/**/*.{${FilesMap.getFilesStr("images")}}`)
    .on("add", parallel("uploadFile"))
    .on("change", parallel("uploadFile"));
  // Svg иконки
  watch(`${BASE_DIR}/icons/**/*.${FilesMap.getFilesStr("icons")}`)
    .on("add", parallel("icons"))
    .on("change", parallel("icons"));
  // Шрифты
  watch(`${DIST_DIR}/**/*.{${FilesMap.getFilesStr("fonts")}}`)
    .on("add", parallel("uploadFile"))
    .on("change", parallel("uploadFile"));
  watch(`${BASE_DIR}/**/*.{${FilesMap.getFilesStr("fonts")}}`).on(
    "change",
    parallel("fonts")
  );
  // Html
  watch(`${BASE_DIR}/**/*.{${FilesMap.getFilesStr("html")}}`).on(
    "change",
    exports.html
  );

  watch(`${DIST_DIR}/**/*.{${FilesMap.getFilesStr("html")}}`)
    .on("change", exports.uploadFile)
    .on("add", exports.uploadFile);
  // .on("all", exports.uploadFile);
  // Javascript
  watch(`${BASE_DIR}/**/*.${FilesMap.getFilesStr("js")}`)
    .on("change", parallel("scripts"))
    .on("add", parallel("scripts"));
  // watch(`${distDir}"/**/*.js`).on("change", uploadFile).on("add",  uploadFile);
  watch(`${DIST_DIR}/**/*.${FilesMap.getFilesStr("js")}`)
    .on("change", parallel("uploadFile"))
    .on("add", parallel("uploadFile"));
};

module.exports = startwatch;
