const {
  FilesMap,
  Paths,
  preprocessorOn,
  preprocessor,
} = require("./constants");
const { watch, parallel } = require("gulp");

const { browsersyncTask } = require("./browsersync");
exports.browserSync = browsersyncTask;
exports.fonts = require("./fonts");
exports.scripts = require("./scripts");
exports.styles = require("./styles");
exports.cleanDist = require("./clean");
exports.html = require("./html");
exports.images = require("./images");
exports.icons = require("./icons");
const { checkConfig } = require("./config-check");
exports.checkConfig = checkConfig;
exports.downloadFiles = require("./downloadFiles");
exports.uploadFile = require("./uploadFile");
exports.startwatch = require("./watch");

const startwatch = () => {
  // Стили
  const pathStyleFiles = preprocessorOn
    ? `${Paths.baseDir}/${preprocessor}/**/*.${preprocessor}`
    : `${Paths.baseDir}/css/**/*.css`;

  watch(pathStyleFiles)
    .on("add", parallel("styles"))
    .on("change", parallel("styles"));
  watch(`${Paths.distDir}/**/*.css`)
    .on("add", parallel("uploadFile"))
    .on("change", parallel("uploadFile"));
  // Изображения
  watch(`${Paths.distDir}/**/*.{${FilesMap.getFilesStr("images")}}`)
    .on("add", parallel("uploadFile"))
    .on("change", parallel("uploadFile"));
  // Svg иконки
  watch(`${Paths.baseDir}/icons/**/*.${FilesMap.getFilesStr("icons")}`)
    .on("add", parallel("icons"))
    .on("change", parallel("icons"));
  // Шрифты
  watch(`${Paths.distDir}/**/*.{${FilesMap.getFilesStr("fonts")}}`)
    .on("add", parallel("uploadFile"))
    .on("change", parallel("uploadFile"));
  watch(`${Paths.baseDir}/**/*.{${FilesMap.getFilesStr("fonts")}}`).on(
    "change",
    parallel("fonts")
  );
  // Html
  watch(`${Paths.baseDir}/**/*.{${FilesMap.getFilesStr("html")}}`).on(
    "change",
    exports.html
  );
  watch(`${Paths.distDir}/**/*.{${FilesMap.getFilesStr("html")}}`)
    .on("change", exports.uploadFile)
    .on("add", exports.uploadFile);
  // Javascript
  watch(`${Paths.baseDir}/**/*.${FilesMap.getFilesStr("js")}`)
    .on("change", parallel("scripts"))
    .on("add", parallel("scripts"));
  // watch(`${distDir}"/**/*.js`).on("change", uploadFile).on("add",  uploadFile);
  watch(`${Paths.distDir}/**/*.${FilesMap.getFilesStr("js")}`)
    .on("change", parallel("uploadFile"))
    .on("add", parallel("uploadFile"));
};

module.exports = startwatch;
