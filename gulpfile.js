import gulp from "gulp";
const { parallel, series } = gulp;

import { browserSyncTask } from "./gulp-config/tasks/browserSync.js";
import fonts from "./gulp-config/tasks/fonts.js";
import scripts from "./gulp-config/tasks/scripts.js";
import styles from "./gulp-config/tasks/styles.js";
import cleanBuildDist from "./gulp-config/tasks/clean-build-dist.js";
import htm from "./gulp-config/tasks/htm.js";
import htmlTemplate from "./gulp-config/tasks/htmlTemplate.js";
import htmlTemplateJsons from "./gulp-config/tasks/htmlTemplateJsons.js";
import images from "./gulp-config/tasks/images.js";
import icons from "./gulp-config/tasks/icons.js";
import checkConfig from "./gulp-config/tasks/config-check.js";
import downloadFiles from "./gulp-config/tasks/downloadFiles.js";
import uploadFile from "./gulp-config/tasks/uploadFile.js";
import startWatch from "./gulp-config/tasks/watch.js";
import buildProject from "./gulp-config/tasks/buildProject.js";
import uploadAllFiles from "./gulp-config/tasks/uploadAllFiles.js";

const mainTasks = parallel(htm, scripts, images, fonts, styles, icons);
const devTasks = parallel(browserSyncTask, startWatch);

export const build = series(cleanBuildDist, mainTasks);
export const dev = series(checkConfig, devTasks);
export const download = series(checkConfig, downloadFiles);
export { cleanBuildDist };
export const move = buildProject;
export const uploadAll = uploadAllFiles;

export default dev;

export {
  fonts,
  scripts,
  styles,
  htm,
  images,
  icons,
  uploadFile,
  htmlTemplate,
  htmlTemplateJsons,
};
