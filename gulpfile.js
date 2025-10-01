import gulp from "gulp";
import {
  browserSyncTask,
  htm,
  scripts,
  images,
  fonts,
  styles,
  icons,
  showConfig,
  downloadFiles,
  startWatch,
  cleanDir,
  validateEnv,
} from "./gulp-config/tasks/index.js";

const { parallel, series } = gulp;

const mainTasks = parallel(htm, scripts, images, fonts, styles, icons);
const devTasks = parallel(browserSyncTask, startWatch);

export const build = series(cleanDir, mainTasks);
export const dev = series(validateEnv, showConfig, devTasks);
export const download = series(
  validateEnv,
  showConfig,
  cleanDir,
  downloadFiles,
);

export default dev;
