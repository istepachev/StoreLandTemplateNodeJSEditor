import { src, dest } from "../../gulpfile.js";
import { Paths } from "../const.js";
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
      })
    )
    .pipe(dest(Paths.icons.dest));
}

export default icons;
