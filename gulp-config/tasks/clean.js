import { DIST_DIR } from "../const.js";
import { deleteSync } from "del";

async function cleanDist() {
  deleteSync(DIST_DIR, { force: true });
}

export default cleanDist;
