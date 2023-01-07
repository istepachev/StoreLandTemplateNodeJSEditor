import gulp from "gulp";
const { parallel, series } = gulp;

import { browsersyncTask } from "./tasks/browsersync.js";
import fonts from "./tasks/fonts.js";
import scripts from "./tasks/scripts.js";
import styles from "./tasks/styles.js";
import cleanDist from "./tasks/clean.js";
import html from "./tasks/html.js";
import images from "./tasks/images.js";
import icons from "./tasks/icons.js";
import { checkConfig } from "./tasks/config-check.js";
import downloadFiles from "./tasks/downloadFiles.js";
import uploadFile from "./tasks/uploadFile.js";
import startwatch from "./tasks/watch.js";

gulp.task(
  "build",
  parallel(cleanDist, html, scripts, images, fonts, styles, icons)
);
gulp.task("download", series(checkConfig, downloadFiles));
gulp.task("default", parallel(checkConfig, browsersyncTask, startwatch));

export { fonts, scripts, styles, html, images, icons, uploadFile };
