const { src, dest } = require("gulp");
const { Paths } = require("./constants");
const svgSprite = require("gulp-svg-sprite");

const icons = () =>
  src(Paths.icons.src)
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: ".",
            sprite: "sprite.svg",
          },
        },
      })
    )
    .pipe(dest(distDir));

module.exports = icons;
