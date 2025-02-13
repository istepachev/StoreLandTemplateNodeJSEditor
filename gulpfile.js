import gulp from "gulp";
import {
  browserSyncTask,
  htm,
  scripts,
  images,
  fonts,
  styles,
  icons,
  cleanBuildDist,
  checkConfig,
  downloadFiles,
  startWatch,
} from "./gulp-config/tasks/index.js";

const { parallel, series } = gulp;

const mainTasks = parallel(htm, scripts, images, fonts, styles, icons);
const devTasks = parallel(browserSyncTask, startWatch);

export const build = series(cleanBuildDist, mainTasks);
export const dev = series(checkConfig, devTasks);
export const download = series(checkConfig, downloadFiles);

export default dev;
