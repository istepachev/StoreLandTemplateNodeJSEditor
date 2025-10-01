import { deleteSync } from 'del';
import Config from '../const.js';

const { DIST_DIR, DOWNLOAD_DIR } = Config;

async function cleanDir() {
  deleteSync(`./${DIST_DIR}`, { force: true });

  deleteSync(`./${DOWNLOAD_DIR}`, { force: true });
}

export default cleanDir;
