import { FilesMap, Paths, BASE_DIR, DIST_DIR } from "../const.js";

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
  watch(Paths.styles.src).on("all", styles);
  watch(`${BASE_DIR}/images/**/*.${FilesMap.getFilesStr("images")}`).on(
    "all",
    images
  );
  watch(`${BASE_DIR}/icons/**/*.${FilesMap.getFilesStr("icons")}`).on(
    "all",
    icons
  );
  watch(`${BASE_DIR}/**/*.{${FilesMap.getFilesStr("fonts")}}`).on("all", fonts);
  watch(`${BASE_DIR}/**/*.{${FilesMap.getFilesStr("html")}}`).on("all", html);
  watch(`${BASE_DIR}/**/*.${FilesMap.getFilesStr("js")}`).on("all", scripts);

  watch(`${DIST_DIR}/**/*.*`).on("all", uploadFile);
}

export default startwatch;
