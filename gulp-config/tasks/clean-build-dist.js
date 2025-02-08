import Config from '../const.js';
const {
  dirs: { DIST_DIR },
} = Config;
import { deleteSync } from 'del';

async function cleanBuildDist() {
  deleteSync(DIST_DIR, { force: true });
}

export default cleanBuildDist;
