import { Paths } from "../const.js";
import { deleteSync } from "del";

async function cleanDist() {
  deleteSync(Paths.clean, { force: true });
}

export default cleanDist;
