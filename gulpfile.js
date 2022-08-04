const { src, dest, parallel, series, watch } = require("gulp");

const { browsersyncTask } = require("./tasks/browsersync");
exports.browserSync = browsersyncTask;
exports.fonts = require("./tasks/fonts");
exports.scripts = require("./tasks/scripts");
exports.styles = require("./tasks/styles");
exports.cleanDist = require("./tasks/clean");
exports.html = require("./tasks/html");
exports.images = require("./tasks/images");
exports.icons = require("./tasks/icons");
const { checkConfig } = require("./tasks/config-check");
exports.checkConfig = checkConfig;
exports.downloadFiles = require("./tasks/downloadFiles");
exports.uploadFile = require("./tasks/uploadFile");
exports.startwatch = require("./tasks/watch");

exports.build = parallel(
  exports.cleanDist,
  exports.html,
  exports.scripts,
  exports.images,
  exports.fonts,
  exports.styles,
  exports.icons
);
exports.download = series(exports.checkConfig, exports.downloadFiles);

exports.default = parallel(
  exports.checkConfig,
  exports.browserSync,
  exports.startwatch
);
