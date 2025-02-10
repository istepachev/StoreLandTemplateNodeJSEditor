import Config from '../const.js';
import { deleteSync } from 'del';

const {
  dirs: { DIST_DIR },
} = Config;

async function cleanBuildDist() {
  deleteSync(DIST_DIR, { force: true });
}

export default cleanBuildDist;
