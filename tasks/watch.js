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
  watch(`${Paths.distDir}/**/*.{${FilesMap.images.join()}}`)
    .on("add", parallel("uploadFile"))
    .on("change", parallel("uploadFile"));
  // Svg иконки
  watch(`${Paths.baseDir}/icons/**/*.svg`)
    .on("add", parallel("icons"))
    .on("change", parallel("icons"));
  // Шрифты
  watch(`${Paths.distDir}/**/*.{${FilesMap.fonts.join()}}`)
    .on("add", parallel("uploadFile"))
    .on("change", parallel("uploadFile"));
  watch(`${Paths.baseDir}/**/*.{${FilesMap.fonts.join()}}`).on(
    "change",
    parallel("fonts")
  );
  // Html
  watch(`${Paths.baseDir}/**/*.{${FilesMap.html.join()}}`).on(
    "change",
    (evt) => {
      console.log(evt);
      console.log(exports.html(evt));
    }
    // (evt) => {
    //   console.log(evt);
    //   console.log(parallel("html"));
    // }
  );
  watch(`${Paths.distDir}/**/*.{${FilesMap.html.join()}}`)
    .on("change", parallel("uploadFile"))
    .on("add", parallel("uploadFile"));
  // Javascript
  watch(`${Paths.baseDir}/**/*.${FilesMap.js.join()}`)
    .on("change", parallel("scripts"))
    .on("add", parallel("scripts"));
  // watch(`${distDir}"/**/*.js`).on("change", uploadFile).on("add",  uploadFile);
  watch(`${Paths.distDir}/**/*.${FilesMap.js.join()}`)
    .on("change", parallel("uploadFile"))
    .on("add", parallel("uploadFile"));
};

module.exports = startwatch;
