import { src, dest } from 'gulp';
import path from 'node:path';
import Config from '../const.js';
import plumber from 'gulp-plumber';

const {
  Paths,
  dirs: { DEFAULT_FOLDER_NAME },
  env: { IS_BUILD },
} = Config;

async function scripts(evt, filePath = '') {
  const parentFileFolderName = path.basename(path.dirname(filePath));

  if (parentFileFolderName === DEFAULT_FOLDER_NAME) {
    return src(filePath).pipe(dest(Paths.scripts.dest));
  }

  const PATH = IS_BUILD ? Paths.scripts.build : filePath;

  return src(PATH).pipe(plumber()).pipe(dest(Paths.scripts.dest));
}

export default scripts;
