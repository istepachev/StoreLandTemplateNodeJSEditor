import { src, dest } from 'gulp';
import Config from '../const.js';
import svgSprite from 'gulp-svg-sprite';

const { Paths } = Config;

async function icons() {
  return src(Paths.icons.watch)
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: '.',
            sprite: 'sprite.svg',
          },
        },
      }),
    )
    .pipe(dest(Paths.icons.dest));
}

export default icons;
