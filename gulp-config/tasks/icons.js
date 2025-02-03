import { src, dest } from "gulp";
import Config from "../const.js";
const { Paths } = Config;
import svgSprite from "gulp-svg-sprite";

async function icons() {
  return src(Paths.icons.watch)
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: ".",
            sprite: "sprite.svg",
          },
        },
      }),
    )
    .pipe(dest(Paths.icons.dest));
}

export default icons;
