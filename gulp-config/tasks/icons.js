import { src, dest } from "../../gulpfile.js";
import { Paths } from "../const.js";
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
