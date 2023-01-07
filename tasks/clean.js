import { Paths } from "./constants.js";
import {deleteSync} from "del";

function cleanDist() {
  deleteSync(Paths.clean, { force: true });
}

export default cleanDist;
