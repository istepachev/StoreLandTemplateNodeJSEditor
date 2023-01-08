import gulp from "gulp";
const { parallel, series, src, dest, watch } = gulp;

import { browsersyncTask } from "./gulp-config/tasks/browsersync.js";
import fonts from "./gulp-config/tasks/fonts.js";
import scripts from "./gulp-config/tasks/scripts.js";
import styles from "./gulp-config/tasks/styles.js";
import cleanDist from "./gulp-config/tasks/clean.js";
import html from "./gulp-config/tasks/html.js";
import images from "./gulp-config/tasks/images.js";
import icons from "./gulp-config/tasks/icons.js";
import { checkConfig } from "./gulp-config/tasks/config-check.js";
import downloadFiles from "./gulp-config/tasks/downloadFiles.js";
import uploadFile from "./gulp-config/tasks/uploadFile.js";
import startwatch from "./gulp-config/tasks/watch.js";

gulp.task(
  "build",
  parallel(cleanDist, html, scripts, images, fonts, styles, icons)
);
gulp.task("download", series(checkConfig, downloadFiles));
gulp.task(
  "default",
  parallel(checkConfig, parallel(browsersyncTask, startwatch))
);
gulp.task("init", checkConfig);

export { src, dest, watch };
export { fonts, scripts, styles, html, images, icons, uploadFile };
