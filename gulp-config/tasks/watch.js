import { watch } from "gulp";
import Config from "../const.js";
const { Paths } = Config;

import {
  fonts,
  scripts,
  styles,
  html,
  images,
  icons,
  uploadFile,
} from "../../gulpfile.js";

function startWatch() {
  watch(Paths.styles.watch).on("all", styles);
  watch(Paths.images.watch).on("all", images);
  watch(Paths.icons.watch).on("all", icons);
  watch(Paths.fonts.watch).on("all", fonts);
  watch(Paths.html.watch).on("all", html);
  watch(Paths.htmlTemplateJsons.watch).on("all", html);
  watch(Paths.scripts.watch).on("all", scripts);

  watch(Paths.dist).on("all", uploadFile);
}

export default startWatch;
