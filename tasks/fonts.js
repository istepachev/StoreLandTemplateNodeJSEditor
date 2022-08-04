const { src, dest } = require("gulp");
const { Paths, fontswatch } = require("./constants");
const { isBuild } = require("./utils");

const fonts = (filePath = "") =>
  src(isBuild(filePath) ? `src/fonts/**/*.{${fontswatch}}` : filePath)
    .pipe(plumber())
    .pipe(dest(Paths.buildStatic));

module.exports = fonts;
