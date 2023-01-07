import { Paths } from "../const.js";
import { deleteSync } from "del";

function cleanDist() {
  deleteSync(Paths.clean, { force: true });
}

export default cleanDist;
