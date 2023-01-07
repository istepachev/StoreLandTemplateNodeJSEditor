import gulp from "gulp";
const { src, dest } = gulp;
import { Paths } from "./constants.js";
import svgSprite from "gulp-svg-sprite";

function icons() {
  return src(Paths.icons.src)
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
}

export default icons;
