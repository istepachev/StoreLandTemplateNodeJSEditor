import { Paths } from "../const.js";

import {
  fonts,
  scripts,
  styles,
  html,
  images,
  icons,
  uploadFile,
  watch,
} from "../../gulpfile.js";

function startwatch() {
  watch(Paths.styles.watch).on("all", styles);
  watch(Paths.images.watch).on("all", images);
  watch(Paths.icons.watch).on("all", icons);
  watch(Paths.fonts.watch).on("all", fonts);
  watch(Paths.html.watch).on("all", html);
  watch(Paths.htmlTemplateJsons).on("change", () => html());
  watch(Paths.scripts.watch).on("all", scripts);

  watch(Paths.dist).on("all", uploadFile);
}

export default startwatch;
